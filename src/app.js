import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRouter from './routes/users.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

app.use(cookieParser());

app.use('/api', userRouter);

export default app;
