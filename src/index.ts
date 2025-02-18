import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swaggerConfig';
import routes from './routes/routes';
import requestIdMiddleware from './middleware/requestIdMiddleware';
import loggingMiddleware from './middleware/loggingMiddleware';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware';
import rateLimitMiddleware from './middleware/rateLimitMiddleware';

const app = express();
const port = process.env.PORT || 3001;

app.use(requestIdMiddleware);
app.use(loggingMiddleware);
app.use(rateLimitMiddleware);
app.use(bodyParser.json());
app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
