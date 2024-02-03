import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionHandler } from './lib/exceptionhandler.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters( new GlobalExceptionHandler());
  await app.listen(3000);
  console.log("APP RUNNING ON PORT 3000 🚀");
}
bootstrap();
