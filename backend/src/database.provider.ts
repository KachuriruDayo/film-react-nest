import mongoose from 'mongoose';
import { AppConfig } from './app.config.provider';

export const databaseProvider = {
  provide: 'DATABASE',
  useFactory: (config: AppConfig) => {
    const options = {
      url: config.database.url,
      driver: config.database.driver,
    };
    return mongoose.connect(options.url);
  },
  inject: [{ token: 'CONFIG', optional: true }],
};
