import app from './app.js';
import { sequelize } from './config/db.js';
import { logger } from './config/logger.js';
import './config/dotenv.js';

const PORT = process.env.PORT ?? 3001;

sequelize.sync().then(() => {
  logger.info('Database synced');
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
});
