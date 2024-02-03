import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import dishesRouter from './routes/api/dishes-router.js';
import authRouter from './routes/api/auth-router.js';
import basketRouter from './routes/api/baskets-router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: 'json' };

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/dishes', dishesRouter);
app.use('/baskets', basketRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).json({ message });
});

export default app;
