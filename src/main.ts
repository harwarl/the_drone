import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GLOBAL_PREFIX } from 'utils/constants';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization, x-api-key',
  });
  await app.listen(process.env.PORT ?? 4500);
}
bootstrap();
