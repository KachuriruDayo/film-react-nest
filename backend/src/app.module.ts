import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (config: ConfigService) => ({
        type: config.get<any>('DATABASE_DRIVER'),
        host: config.get<string>('MAIN_DB_HOST'),
        port: config.get<number>('MAIN_DB_PORT'),
        username: config.get<string>('MAIN_DB_USERNAME'),
        password: config.get<string>('MAIN_DB_PASSWORD'),
        database: config.get<string>('MAIN_DB_DATABASE_NAME'),
        entities: [__dirname + '/entity/*{.js,.ts}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    FilmsModule,
    OrderModule,
  ],
})
export class AppModule {}
