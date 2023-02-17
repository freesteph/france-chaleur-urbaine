import { TypeGroupLegend } from 'src/types/TypeGroupLegend';
import {
  localTypeEnergy,
  localTypeGas,
  themeDefEnergy,
  themeDefTypeGas,
} from './businessRules';

enum Layer {
  outline = 'outline',
  demands = 'demands',
  zoneDP = 'zoneDP',
  buildings = 'buildings',
}

export const layerNameOptions = Object.values(Layer);
const energyNameOptions: ('gas' | 'fuelOil')[] = ['fuelOil', 'gas'];
const gasUsageNameOptions = ['R', 'T', 'I'];

export type LayerNameOption = (typeof layerNameOptions)[number];
export type EnergyNameOption = (typeof energyNameOptions)[number];
export type gasUsageNameOption = (typeof gasUsageNameOptions)[number];

export type TypeLayerDisplay = {
  outline: boolean;
  zoneDP: boolean;
  demands: boolean;
  gasUsageGroup: boolean;
  buildings: boolean;
  gasUsage: string[];
  energy: ('gas' | 'fuelOil')[];
  gasUsageValues: [number, number];
  energyGasValues: [number, number];
  energyFuelValues: [number, number];
};

export const defaultLayerDisplay: TypeLayerDisplay = {
  outline: true,
  zoneDP: false,
  demands: false,
  gasUsageGroup: true,
  buildings: false,
  gasUsage: gasUsageNameOptions,
  energy: energyNameOptions,
  gasUsageValues: [1000, Number.MAX_VALUE],
  energyGasValues: [50, Number.MAX_VALUE],
  energyFuelValues: [50, Number.MAX_VALUE],
};

const legendData: (string | TypeGroupLegend)[] = [
  {
    id: 'heat-network',
    entries: [
      {
        id: 'outline',
        label: 'Réseaux de chaleur',
        subLegend: 'RDC',
        info: (
          <>
            Pour les réseaux classés, le raccordement des bâtiments neufs ou
            renouvelant leur installation de chauffage au-dessus d'une certaine
            puissance est obligatoire dès lors qu'ils sont situés dans le
            périmètre de développement prioritaire (sauf dérogation).
            <br />
            Les réseaux affichés comme classés sont ceux listés par arrêté du 23
            décembre 2022. Collectivités : pour signaler un dé-classement,
            cliquez sur Contribuer.
          </>
        ),
        infoPosition: 'bottom',
      },
    ],
    type: 'list',
  },
  {
    id: 'zoneDP',
    entries: [
      {
        id: 'zoneDP',
        label: 'Périmètres de développement prioritaire',
        className: 'legend-zoneDP',
      },
    ],
    type: 'list',
  },
  'contributeButton',
  'separator',
  {
    id: 'demands',
    entries: [
      {
        id: 'demands',
        label: 'Demandes de raccordement sur France Chaleur Urbaine',
        className: 'legend-demands',
      },
    ],
    type: 'list',
  },
  'separator',
  {
    id: 'gasUsageGroup',
    entries: [
      {
        id: 'gasUsageGroup',
        label: 'Consommations globales de gaz',
        bgColor: 'red',
      },
    ],
    type: 'group',
  },
  {
    id: 'gasUsage',
    entries: defaultLayerDisplay.gasUsage.map((id: string) => ({
      id,
      label: localTypeGas[id] || localTypeGas.unknow,
      bgColor: themeDefTypeGas[id].color,
      className: 'legend-energy',
    })),
    subLegend: 'GasUsage',
    type: 'group',
    subGroup: true,
    linkto: ['gasUsageGroup'],
  },
  {
    id: 'energy',
    entries: [
      {
        id: 'gas',
        label: localTypeEnergy.gas,
        bgColor: themeDefEnergy.gas.color,
      },
    ],
    subLegend: 'EnergyGas',
    type: 'group',
  },
  'separator',
  {
    id: 'energy',
    entries: [
      {
        id: 'fuelOil',
        label: localTypeEnergy.fuelOil,
        bgColor: themeDefEnergy.fuelOil.color,
      },
    ],
    subLegend: 'EnergyFuel',
    type: 'group',
  },
  'separator',
  {
    id: 'buildings',
    entries: [
      {
        id: 'buildings',
        label: 'Caractéristiques des bâtiments',
        subLegend: 'DPE',
        info: "Les DPE affichés par bâtiment résultent d'un extrapolation des DPE par logement ancienne définition. Ils sont donnés à titre informatif et non-officiel, sans aucune valeur légale.",
      },
    ],
    type: 'list',
  },
  'separator',
  'sources',
];

const param = {
  minZoomData: 13,
  minZoom: 4,
  maxZoom: 17,
  defaultZoom: 4,
  lng: 2.3,
  lat: 45,
  defaultLayerDisplay,
  legendData,
};

export default param;