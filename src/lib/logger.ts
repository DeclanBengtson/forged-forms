import winston from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : process.env.LOG_LEVEL || 'info';
};

// Define different formats for different environments
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info: winston.Logform.TransformableInfo) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define different transports based on environment
const transports = [];

// Always log to console in development
if (process.env.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: format,
    })
  );
} else {
  // In production, use JSON format for better parsing
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
    })
  );
}

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports,
});

// Create structured logging methods
export const log = {
  error: (message: string, meta?: any) => {
    logger.error(message, meta);
  },
  warn: (message: string, meta?: any) => {
    logger.warn(message, meta);
  },
  info: (message: string, meta?: any) => {
    logger.info(message, meta);
  },
  http: (message: string, meta?: any) => {
    logger.http(message, meta);
  },
  debug: (message: string, meta?: any) => {
    logger.debug(message, meta);
  },
};

// Specific logging methods for different contexts
export const webhookLogger = {
  info: (message: string, eventId?: string, meta?: any) => {
    logger.info(`[WEBHOOK] ${message}`, { eventId, ...meta });
  },
  error: (message: string, eventId?: string, error?: any, meta?: any) => {
    logger.error(`[WEBHOOK] ${message}`, { 
      eventId, 
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      ...meta 
    });
  },
  warn: (message: string, eventId?: string, meta?: any) => {
    logger.warn(`[WEBHOOK] ${message}`, { eventId, ...meta });
  },
};

export const rateLimitLogger = {
  info: (message: string, identifier?: string, meta?: any) => {
    logger.info(`[RATE_LIMIT] ${message}`, { identifier, ...meta });
  },
  warn: (message: string, identifier?: string, meta?: any) => {
    logger.warn(`[RATE_LIMIT] ${message}`, { identifier, ...meta });
  },
  error: (message: string, identifier?: string, error?: any, meta?: any) => {
    logger.error(`[RATE_LIMIT] ${message}`, { 
      identifier,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      ...meta 
    });
  },
};

export const apiLogger = {
  info: (message: string, endpoint?: string, meta?: any) => {
    logger.info(`[API] ${message}`, { endpoint, ...meta });
  },
  error: (message: string, endpoint?: string, error?: any, meta?: any) => {
    logger.error(`[API] ${message}`, { 
      endpoint,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      ...meta 
    });
  },
  warn: (message: string, endpoint?: string, meta?: any) => {
    logger.warn(`[API] ${message}`, { endpoint, ...meta });
  },
};

export default logger; 