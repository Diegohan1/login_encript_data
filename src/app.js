import express from 'express';
import userRouter from './routes/users.routes.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api', userRouter);

export default app;
