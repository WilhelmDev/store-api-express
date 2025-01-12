import express from 'express';
import { logServerStart, logRouteAccess } from './utils/logger';
import routes from './routes';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

// Middleware para loggear accesos a rutas
app.use((req, res, next) => {
  logRouteAccess(req.method, req.path, req.ip || 'unknown');
  next();
});

app.use('/api', routes)

app.listen(port, () => {
  logServerStart(+port)
});
