import { StatusCodes } from 'http-status-codes';

export function validateId(req, res, next) {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid ID' });
  }
  next();
}