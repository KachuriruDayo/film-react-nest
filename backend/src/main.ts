import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import 'dotenv/config';
import { JsonLogger } from './logger/jsonLogger';
import { TSKVLogger } from './logger/tskvLogger';
import { DevLogger } from './logger/devLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix(process.env.PREFIX || 'api/afisha');
  app.enableCors();
  app.useLogger(new DevLogger());
  app.useLogger(new JsonLogger());
  app.useLogger(new TSKVLogger());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
