import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_APP_CLIENT_ID) {
  throw new Error('COGNITO_USER_POOL_ID and COGNITO_APP_CLIENT_ID must be set in environment variables');
}

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_APP_CLIENT_ID,
};

export const userPool = new CognitoUserPool(poolData);

export const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});