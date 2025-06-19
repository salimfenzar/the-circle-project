import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Zorg dat frontend toegang heeft (handig voor Angular dev server)
  app.enableCors({
    origin: '*', // voor dev, later strakker maken
  });


  // ✅ Eventueel loggen naar console
  await app.listen(3000);
  console.log(`🚀 The Circle API is running`);
}
bootstrap();
