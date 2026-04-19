import type { NextFunction, Request, Response } from 'express';

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[ERROR] Unhandled error:', error instanceof Error ? error.message : String(error));
  res.status(500).json({ error: 'Server error. Please try again later.' });
}
