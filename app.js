import 'dotenv/config';
import express from 'express';
import 'dotenv/config';
import logger from 'morgan';
import cors from 'cors';
import {initDb} from './db/sequilize.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import authRouter from './routes/authRouter.js';
import contactsRouter from './routes/contactsRouter.js';

const swaggerDocument = YAML.load(path.join(process.cwd(), 'swagger.yaml'));
const errorHandler = (err, req, res, next) => {
  const {status = 500, message = 'Internal Server Error'} = err;
  res.status(status).json({message});
};

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);
app.use('/avatars', express.static('public/avatars'));
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

const start = async () => {
  await initDb();

  app.listen(3000, () => {
    console.log('🚀 Server running on port 3000');
  });
};

start().then(r => console.log('All started'));
