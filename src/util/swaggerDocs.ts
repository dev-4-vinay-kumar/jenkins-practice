import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API documentation for User routes',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/api/*.ts'], // Path to the API docs
};

// Swagger docs setup
const swaggerDocs = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Application): void => {
  app.use('/api/v1/user/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
