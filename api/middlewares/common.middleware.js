import { StatusCodes } from 'http-status-codes';

export function validateId(req, res, next) {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid ID' });
  }
  next();
}

export function errorHandler(err, _req, res, next) {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: err.message,
      details: err.stack
  });
  next();
}