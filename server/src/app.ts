import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { authMiddleware, errorHandlerMiddleware } from './middleware';

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://sandro-20240214.web.app',
    'https://sandro-20240214.firebaseapp.com'
  ]
}));

app.use(authMiddleware);
app.use(router);

// Router
// Invalid path

app.use(errorHandlerMiddleware);

export { app };