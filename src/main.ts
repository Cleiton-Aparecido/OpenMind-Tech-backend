import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    credentials: false,
  });

  setupSwagger(app);

  console.log('http://localhost/' + (process.env.PORT ?? 3000));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
