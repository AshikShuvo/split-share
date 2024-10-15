import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/allException.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,      // Strip any properties that don't exist in the DTO
      forbidNonWhitelisted: true,  // Throw an error if non-whitelisted properties are found
      transform: true,      // Automatically transform payloads to DTO instances
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(helmet()); // Apply Helmet middleware
  app.enableCors({
    origin: 'http://localhost:3080',  // Adjust as needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my NestJS project')
    .setVersion('1.0')
    .addBearerAuth() // This adds JWT support in Swagger
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3080);
}
bootstrap();
