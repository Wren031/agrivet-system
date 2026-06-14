import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Set global prefix first
  app.setGlobalPrefix('api');

  // Serve uploaded files statically
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:8080', 'http://10.0.2.2:8080'],
    credentials: true,
  });

  // 3. Global validation rules
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // 4. Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // 5. Get port configuration and listen
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000; // Fallback to 3000 if not found

  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}/api`);
}
bootstrap();