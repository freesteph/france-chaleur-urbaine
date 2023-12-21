import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ZodRawShape, z } from 'zod';
import { logger } from './logger';
import { HttpStatusCode } from 'axios';

/**
 * Valide un objet selon un schéma zod.
 */
export async function validateObjectSchema<Shape extends ZodRawShape>(
  object: any,
  shape: Shape
): Promise<z.infer<z.ZodObject<Shape>>> {
  return z.strictObject(shape).parseAsync(object);
}

/**
 * Encapsule une route API pour logger et gérer automatiquement les erreurs :
 *  - validation Zod => retourne un statut 400
 *  - postgres => retourne un statut 500
 */
export function handleRouteErrors(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const handlerResult = await handler(req, res);
      if (!res.headersSent) {
        res.status(HttpStatusCode.Ok).json(handlerResult);
      }
    } catch (error) {
      let errorMessage = error;
      if (error instanceof Error) {
        if (error.name === 'ZodError') {
          logger.error('validation error', {
            error,
          });
          return res.status(400).json({
            message: 'Paramètres incorrects',
            error: error,
          });
        }

        if ((error as any).routine) {
          logger.error('database error', {
            error: error,
            query: error.message,
          });
          return res.status(500).json({
            message: 'Une erreur inconnue est survenue',
            error: error.message,
          });
        }
        errorMessage = error.message;
      }
      logger.error('unknown error', {
        error: errorMessage,
        stack: (error as any).stack,
      });
      return res.status(500).json({
        message: 'Une erreur inconnue est survenue',
        error: errorMessage,
      });
    }
  };
}