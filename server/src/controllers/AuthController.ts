import { Request, Response } from 'express';
import { CognitoUser, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { userPool } from '../config/cognitoConfig';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export class AuthController {
  async signUp(req: Request, res: Response) {
    const { username, password, email, phoneNumber } = req.body;

    if (!username || !password || !email || !phoneNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'phone_number', Value: phoneNumber })
    ];

    userPool.signUp(username, password, attributeList, [], async (err, result) => {
      if (err) {
        console.error('Error signing up user:', err);
        return res.status(400).json({ 
          message: 'Error signing up user', 
          error: err.message || 'Unknown error occurred'
        });
      }

      try {
        await this.confirmUser(username);
        res.status(200).json({ message: 'User signed up and confirmed successfully', userSub: result?.userSub });
      } catch (error) {
        console.error('Error confirming user:', error);
        if (error instanceof Error) {
          res.status(500).json({ message: 'User signed up but could not be confirmed', error: error.message });
        } else {
          res.status(500).json({ message: 'User signed up but could not be confirmed', error: 'An unknown error occurred' });
        }
      }
    });
  }

  async signIn(req: Request, res: Response) {
    const { username, password } = req.body;

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        res.json({
          message: 'Login successful',
          accessToken: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        });
      },
      onFailure: (err) => {
        console.error('Error logging in:', err);
        res.status(400).json({ message: 'Error logging in', error: err.message || 'Unknown error occurred' });
      },
    });
  }

  async signOut(req: Request, res: Response) {
    const { username } = req.body;

    const userData = {
      Username: username,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.signOut(() => {
      res.json({ message: 'User signed out successfully' });
    });
  }

  private async confirmUser(username: string): Promise<void> {
    try {
      await cognitoIdentityServiceProvider.adminConfirmSignUp({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: username
      }).promise();
      console.log(`User ${username} confirmed successfully`);
    } catch (error) {
      console.error(`Error confirming user ${username}:`, error);
      throw error;
    }
  }

  // This method can be used to manually confirm a user if needed
  async manualConfirmUser(req: Request, res: Response) {
    const { username } = req.body;

    try {
      await this.confirmUser(username);
      res.status(200).json({ message: 'User confirmed successfully' });
    } catch (error) {
      console.error('Error confirming user:', error);
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error confirming user', error: error.message });
      } else {
        res.status(500).json({ message: 'Error confirming user', error: 'An unknown error occurred' });
      }
    }
  }
}