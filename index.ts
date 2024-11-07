import express, { Application, Request, Response } from 'express';
import { apiRouter } from './src/routes/routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


const app: Application = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/api/*.ts'], // Path to the API docs
};
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api/v1/user/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  swaggerOptions: {
    docExpansions: 'none',
    persistAuthorization: true,
  },
}));


app.use('/api/v1', apiRouter);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
