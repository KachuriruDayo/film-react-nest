import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { databaseProvider } from './database.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    FilmsModule,
    OrderModule,
  ],
  controllers: [],
  providers: [databaseProvider, configProvider],
})
export class AppModule {}
