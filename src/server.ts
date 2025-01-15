import express from 'express';
import cors from 'cors';
import { logServerStart, logRouteAccess } from './utils/logger';
import routes from './routes';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.use(cors())

// Middleware para loggear accesos a rutas
app.use((req, res, next) => {
  logRouteAccess(req.method, req.path, req.ip || 'unknown');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return;
  }
  next();
});

app.use('/api', routes)

app.listen(port, () => {
  logServerStart(+port)
});
