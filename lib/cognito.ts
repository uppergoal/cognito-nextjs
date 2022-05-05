import {
  CognitoUserPool,
  ICognitoUserPoolData,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
} as ICognitoUserPoolData;

const userPool = new CognitoUserPool(poolData);

export { userPool };
