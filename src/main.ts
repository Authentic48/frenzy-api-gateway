import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const configService = app.get<ConfigService>(ConfigService);
  const port = parseInt(configService.get('APP_PORT'));

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.enableCors();
  app.enableShutdownHooks();

  if (process.env.NODE_ENV !== 'production') {
    setupOpenApi(app);
  }

  await app.listen(port);
}
bootstrap();

function setupOpenApi(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TTK - Api documentation')
    .setDescription('Api description of TinTok')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
}
