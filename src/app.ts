import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes/routes';
import requestIdMiddleware from './middleware/requestIdMiddleware';
import loggingMiddleware from './middleware/loggingMiddleware';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware';
import rateLimitMiddleware from './middleware/rateLimitMiddleware';

const app = express();

app.use(cors());
app.use(requestIdMiddleware);
app.use(loggingMiddleware);
app.use(rateLimitMiddleware);
app.use(bodyParser.json());
app.use(routes);
app.use(errorHandlerMiddleware);

export default app;
