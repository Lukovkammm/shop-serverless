import { PolicyDocument, APIGatewayRequestAuthorizerEvent, APIGatewayAuthorizerResult } from "aws-lambda";

export const basicAuthorizer = async (event: APIGatewayRequestAuthorizerEvent) => {
  console.log('Event: ', event);

  try {
    const { headers, methodArn } = event;
    const creds = headers.Authorization;
    const plainCreds = Buffer.from(creds, 'base64').toString().split(':');
    const [username, password] = plainCreds;
    console.log('Name: ', username, 'Password: ', password);
    
    const response = username === process.env.AUTH_CLIENT_ID && password === process.env.AUTH_CLIENT_SECRET
      ? generateResponse(creds, 'Allow', methodArn)
      : generateResponse(creds, 'Deny', methodArn);

    console.log('Response: ', JSON.stringify(response));
    return response;

  } catch (error) {
    console.log(error)
  }
};

export const main = basicAuthorizer;

type Effect = 'Allow' | 'Deny';
function generatePolicy(effect: Effect, resource: string): PolicyDocument {
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }
    ]
  }
}

function generateResponse(principalId: string, effect: Effect, resource: string): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: generatePolicy(effect, resource)
  }
}