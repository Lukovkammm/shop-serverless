import { AWS } from "@serverless/typescript"
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

const env = dotenv.config();
expand(env);

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dotenv-plugin'],

  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',

    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },

    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
      AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET
    },
  },

  functions: {
    basicAuthorizer: {
      handler: 'src/basicAuthorizer/handler.basicAuthorizer',
      events: [
        {
          http: {
            method: 'get',
            path: '/auth',
            cors: true,
            authorizer: {
              name: 'basicAuthorizer',
              identitySource: 'method.request.header.Authorization',
              type: 'request'
            }
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
