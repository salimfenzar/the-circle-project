import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Zorg dat frontend toegang heeft (handig voor Angular dev server)
  const allowedOrigins = [
  'https://the-circle-project-tn8q.vercel.app', // jouw frontend URL
  'http://localhost:4200' // lokale Angular dev server
];

app.enableCors({
  origin: allowedOrigins,
  credentials: true, // voor cookies of Authorization headers
});

  app.useWebSocketAdapter(new IoAdapter(app));

  // ✅ Eventueel loggen naar console
  await app.listen(3000);
  console.log(`🚀 The Circle API is running`);
}
bootstrap();
