import winston from 'winston';

// Define los niveles de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define los colores para cada nivel de log
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Añade los colores a winston
winston.addColors(colors);

// Define el formato de log
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define los transportes para los logs
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Crea el logger
const logger = winston.createLogger({
  level: 'debug',
  levels,
  format,
  transports,
});

export default logger;

// Funciones de utilidad para logging específico

export const logServerStart = (port: number) => {
  logger.info(`Server started on port ${port}`);
};

export const logDatabaseConnection = () => {
  logger.info('Database connected successfully');
};

export const logDatabaseError = (error: Error) => {
  logger.error(`Database connection error: ${error.message}`);
};

export const logTransactionStart = (transactionId: string) => {
  logger.debug(`Transaction started: ${transactionId}`);
};

export const logTransactionEnd = (transactionId: string) => {
  logger.debug(`Transaction completed: ${transactionId}`);
};

export const logTransactionError = (transactionId: string, error: Error) => {
  logger.error(`Transaction failed: ${transactionId}, Error: ${error.message}`);
};

export const logRouteAccess = (method: string, path: string, ip: string) => {
  logger.http(`${method} ${path} - IP: ${ip}`);
};

export const logAuthenticationAttempt = (userId: string, success: boolean) => {
  if (success) {
    logger.info(`User authenticated successfully: ${userId}`);
  } else {
    logger.warn(`Failed authentication attempt for user: ${userId}`);
  }
};

export const logError = (error: Error) => {
  logger.error(`Unhandled error: ${error.message}`);
  logger.error(error.stack);
};
