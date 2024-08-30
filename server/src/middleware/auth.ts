import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from "aws-jwt-verify";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_APP_CLIENT_ID) {
  throw new Error('COGNITO_USER_POOL_ID and COGNITO_APP_CLIENT_ID must be set in environment variables');
}

const cognitoVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_APP_CLIENT_ID,
});

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const payload = await cognitoVerifier.verify(token);

    (req as any).user = payload;
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(403).json({ message: 'Invalid token', error: (err as Error).message });
  }
};