import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(3000);
  const logger = new Logger('NestApplication');
  logger.log(`Application is running on: ${await app.getUrl()} 🚀`);
}
bootstrap();
