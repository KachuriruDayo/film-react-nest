import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';
import * as process from 'node:process';

import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_DRIVER as any,
      host: 'localhost',
      port: parseInt(process.env.MAIN_DB_PORT),
      username: process.env.MAIN_DB_USERNAME,
      password: process.env.MAIN_DB_PASSWORD,
      database: process.env.MAIN_DB_DATABASE_NAME,
      entities: [__dirname + '/entity/*{.js,.ts}'],
      synchronize: true,
    }),
    FilmsModule,
    OrderModule,
  ],
})
export class AppModule {}
