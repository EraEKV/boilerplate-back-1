import { NextFunction, Request, Response } from 'express';
import AuthService from '../auth/auth-service';

const authService = new AuthService();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjgwYTI2MjI2NzU0NTYzYTA0OTlhYSIsImVtYWlsIjoia29rZW5hb2VyYXN5bEBnbWFpbC5jb20iLCJpYXQiOjE3MTgwOTc1ODIsImV4cCI6MTcxODEwMTE4Mn0.ygbpAzat9Rj3WagJbolpwQyErGOykZdXNPfJ4uv5ZmQ

  const token = authHeader.split(' ')[1];
  const payload = authService.verifyJwt(token);

  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  (req as any).user = payload;
  next();
};
