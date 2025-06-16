import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Zorg dat frontend toegang heeft (handig voor Angular dev server)
  app.enableCors({
    origin: '*', // voor dev, later strakker maken
  });

  // ✅ Swagger configuratie
  const config = new DocumentBuilder()
    .setTitle('The Circle API')
    .setDescription('TruYou + SeeChange backend API')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ Eventueel loggen naar console
  await app.listen(3000);
  console.log(`🚀 The Circle API is running at http://localhost:3000`);
  console.log(`📚 Swagger is available at http://localhost:3000/api`);
}
bootstrap();
