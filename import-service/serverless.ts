import { AWS } from "@serverless/typescript"

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',

    iam: {
      role: {
        statements: [{
          Effect: 'Allow',
          Action: 's3:*',
          Resource: ['${self: provider.environment.ARN_BUCKET}', '${self:provider.environment.ARN_BUCKET}/*']
        },
        {
          Effect: 'Allow',
          Action: 'sqs:SendMessage',
          Resource: 'arn:aws:sqs:eu-west-1:875232290778:catalogItemsQueue'
        }
        ]
      }
    },

    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },

    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      ARN_BUCKET: 'arn:aws:s3:::module-5-uploaded',
      BUCKET: 'module-5-uploaded',
      SQS_URL: 'https://sqs.eu-west-1.amazonaws.com/875232290778/catalogItemsQueue'
    },
  },

  // import the function via paths
  functions: {
    importProductsFile: {
      handler: 'src/importProductsFile/handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: '/import',
            cors: true,
            request: {
              parameters: {
                querystrings: { name: true }
              },
            },
          },
        },
      ],
    },
    importFileParser: {
      handler: 'src/importFileParser/handler.importFileParser',
      events: [
        {
          s3: {
            bucket: '${self: provider.environment.BUCKET}',
            event: 's3:ObjectCreated:*',
            rules: [{
              prefix: 'uploaded/'
            }],
            existing: true
          }
        },
      ]
    }
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
