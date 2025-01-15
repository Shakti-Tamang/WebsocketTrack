import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const options = new DocumentBuilder()
    .setTitle('Location Tracking API') // Set your API title
    .setDescription('API documentation for tracking locations using WebSockets') // Set description
    .setVersion('1.0') // Set version
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document); // 'api' is the URL path to access Swagger UI

  await app.listen(3002);
}
bootstrap();
