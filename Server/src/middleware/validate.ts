import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate =
  <T>(schema: ZodSchema<T>) =>
    (req: Request, res: Response, next: NextFunction): Response | void => {
      try {
        const result = schema.safeParse(req.body);

        if (!result.success) {
          return res.status(400).json({
            error: true,
            message: 'Validation failed.',
            details: result.error.flatten(),
          });
        }
        req.body = result.data;
        return next();
      } catch (err) {
        let errorMessage: string = 'Unknown validation error.';
        let errorDetails: unknown = undefined;

        if (err instanceof ZodError) {
          errorMessage = 'Zod schema parsing error.';
          errorDetails = err.flatten();
        } else if (err instanceof Error) {
          errorMessage = err.message;
          errorDetails = err.stack;
        } else {
          errorDetails = err;
        }

        return res.status(500).json({
          error: true,
          message: errorMessage,
          details: errorDetails,
        });
      }
    };
