import geojsonvt from 'geojson-vt';
import pLimit from 'p-limit';
import vtpbf from 'vt-pbf';
import db from '../../src/db';
import { logger } from '@helpers/logger';

const QUERY_PARALLELISM = 50; // max queries in //

// probably custom bounds around France
const globalX13Min = 3900;
const globalX13Max = 4400;
const globalY13Min = 2700;
const globalY13Max = 3100;

/**
 * Generate tiles from GeoJSON data and store them in a postgres table
 */
export const generateTilesFromGeoJSON = async (
  geojson: GeoJSON.GeoJSON,
  destinationTable: string,
  zoomMin: number,
  zoomMax: number
) => {
  const startTime = Date.now();
  logger.info('start generating vector tiles');
  const tiles = geojsonvt(geojson, {
    maxZoom: zoomMax,
  });
  logger.info('finished generating vector tiles', {
    duration: Date.now() - startTime,
  });

  for (let z = zoomMin; z <= zoomMax; z++) {
    const startTime = Date.now();
    logger.info('start level', { zLevel: z });

    await processInParallel(
      getCoordinatesGenerator(z),
      QUERY_PARALLELISM,
      async ({ x, y, z }) => {
        const tile = tiles.getTile(z, x, y);
        if (tile) {
          await db(destinationTable)
            .insert({
              x,
              y,
              z,
              tile: Buffer.from(
                vtpbf.fromGeojsonVt({ layer: tile }, { version: 2 })
              ),
            })
            .onConflict(['x', 'y', 'z'])
            .ignore();
        }
      }
    );

    logger.info('finished level', {
      zLevel: z,
      duration: Date.now() - startTime,
    });
  }
};

/**
 * Process an iterable in parallel,
 */
async function processInParallel<T>(
  iterable: Iterable<T>,
  maxParallel: number,
  asyncOperation: (item: T) => Promise<void>
): Promise<void> {
  const asyncLimit = pLimit(maxParallel);

  const asyncIterator = iterable[Symbol.iterator]();
  const pendingPromises: Promise<void>[] = [];

  // Fonction pour ajouter une nouvelle opération en cours
  const tryProcessNextOperation = async () => {
    const nextItem = asyncIterator.next();
    if (!nextItem.done) {
      const operationPromise = asyncLimit(() => asyncOperation(nextItem.value));
      pendingPromises.push(operationPromise);
      operationPromise.finally(() => {
        // remove the promise
        const index = pendingPromises.indexOf(operationPromise);
        if (index !== -1) {
          pendingPromises.splice(index, 1);
        }
        tryProcessNextOperation();
      });
    }
  };

  for (let i = 0; i < maxParallel; i++) {
    tryProcessNextOperation();
  }

  // wait for all operations
  while (pendingPromises.length > 0) {
    await Promise.all(pendingPromises);
  }
}

/**
 * Return a generator that generates tile coordinates of a specific zoom level
 */
function* getCoordinatesGenerator(z: number) {
  const x13Min = globalX13Min;
  const x13Max = globalX13Max;
  const y13Min = globalY13Min;
  const y13Max = globalY13Max;
  const xMin = z < 13 ? 0 : x13Min * Math.pow(2, z - 13);
  const xMax = z < 13 ? Math.pow(2, z) : x13Max * Math.pow(2, z - 13);
  const yMin = z < 13 ? 0 : y13Min * Math.pow(2, z - 13);
  const yMax = z < 13 ? Math.pow(2, z) : y13Max * Math.pow(2, z - 13);
  for (let x = xMin; x < xMax; x++) {
    for (let y = yMin; y < yMax; y++) {
      yield { x, y, z };
    }
  }
}
