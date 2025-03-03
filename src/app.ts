import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/routes';
import requestIdMiddleware from './middleware/requestIdMiddleware';
import loggingMiddleware from './middleware/loggingMiddleware';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware';
import rateLimitMiddleware from './middleware/rateLimitMiddleware';
import path from 'path';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(requestIdMiddleware);
app.use(loggingMiddleware);
app.use(rateLimitMiddleware);
app.use(bodyParser.json());
app.use(routes); // Remova o prefixo /api
app.use(errorHandlerMiddleware);

// Documentação
app.use('/docs', express.static(path.join(__dirname, '../docs/api-documentation.html')));

export default app;
