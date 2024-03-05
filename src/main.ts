import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import Logging from './library/Logging';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [process.env.FRONTEND],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'files'), {
    index: false,
    prefix: '/public',
  });

  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);

  Logging.log(`App is running on: ${await app.getUrl()}`);
}
bootstrap();
