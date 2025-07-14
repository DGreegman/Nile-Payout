import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nile Payout System API',
      version: '1.0.0',
      description: 'API documentation for the Nile Payout System'
    },
    servers: [
      {
        url: 'https://nile-payout.vercel.app',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password', 'bank_account', 'store_name'],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the user/vendor',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The email of the user/vendor (unique)',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'The password for the user/vendor',
            },
            bank_account: {
              type: 'string',
              description: 'The bank account number of the vendor',
            },
            store_name: {
              type: 'string',
              description: 'The store name of the vendor',
            },
          },
        },
        Order: {
          type: 'object',
          required: ['order_id', 'amount', 'vendor'],
          properties: {
            order_id: {
              type: 'string',
              description: 'Unique identifier for the order',
            },
            amount: {
              type: 'number',
              format: 'float',
              description: 'The amount of the order',
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed'],
              default: 'pending',
              description: 'The status of the order',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp when the order was created',
            },
            vendor: {
              type: 'string',
              description: 'The ID of the vendor (User ID)',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;