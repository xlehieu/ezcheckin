import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyCookie from '@fastify/cookie';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import chalk from 'chalk';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const logger = new Logger();
  // 1. Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('EZCheckin API') // Tên dự án của bạn
    .setDescription('Tài liệu API cho hệ thống chấm công bằng mã QR')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    await app.register(fastifyCookie as any, {
    secret: 'my-secret', // for cookies signature
  });
  app.setGlobalPrefix('api', { exclude: ['api-docs', ''] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );
  // 2. Tạo tài liệu
  const document = SwaggerModule.createDocument(app, config);
  // 3. Thiết lập đường dẫn truy cập (ví dụ: http://localhost:3000/api)
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // lưu local
    },
  });

  await app.listen(3000);
  logger.log(
    chalk.cyanBright('[EZ CHECKIN]') + ' ' + chalk.green('START SUCCESS'),
  );
}
bootstrap();
