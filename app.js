import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import dishesRouter from './routes/api/dishes-router.js';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/dishes', dishesRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(err.status).json({ message: err.message });
});

export default app;
