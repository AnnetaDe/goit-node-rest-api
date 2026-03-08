import 'dotenv/config';
import express from 'express';
import 'dotenv/config';
import logger from 'morgan';
import cors from 'cors';
import {initDb} from './db/sequilize.js';
import authRouter from './routes/authRouter.js';
import contactsRouter from './routes/contactsRouter.js';

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

const errorHandler = (err, req, res, next) => {
  const {status = 500, message = 'Internal Server Error'} = err;
  res.status(status).json({message});
};
app.use(errorHandler);

const start = async () => {
  await initDb(); // Wait for DB and Sync

  app.listen(3000, () => {
    console.log('🚀 Server running on port 3000');
  });
};

start().then(r => console.log('started'));
