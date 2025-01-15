import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Location Tracking API') // API title
    .setDescription('API documentation for tracking locations using WebSockets') // Description
    .setVersion('1.0') // Version
    .addTag('Location') // Tags for Swagger
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document); // Swagger UI at `/api`

  await app.listen(3002); // Start on port 3002
}
bootstrap();
