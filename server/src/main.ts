import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as fs from 'fs';

async function bootstrap() {
  const configService = new ConfigService();

  const httpsOptions =
    process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH
      ? {
          key: fs.readFileSync(process.env.SSL_KEY_PATH),
          cert: fs.readFileSync(process.env.SSL_CERT_PATH),
        }
      : undefined;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });

  app.setGlobalPrefix('api');

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:8080',
      'http://10.0.2.2:8080',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const appConfig = app.get(ConfigService);
  const port = appConfig.get<number>('app.port') || 3000;

  await app.listen(port);
  const protocol = httpsOptions ? 'https' : 'http';
  console.log(`Server is running on ${protocol}://localhost:${port}/api`);
}
bootstrap();