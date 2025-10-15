import { ZodError } from 'zod';
import ERROR_MESSAGES from '../constants/errorMessages.js';

export function validateData(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue) => ({
            message: `${issue.path.join('.')} is ${issue.message}`,
        }))
        res.status(400).json({ error: ERROR_MESSAGES.INVALID_DATA, details: errorMessages });
      } else {
        res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    }
  };
}