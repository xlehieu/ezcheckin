import fastifyCookie from '@fastify/cookie';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import chalk from 'chalk';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
// dotenv.config({
//   path: '.env',
// });

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
    secret: process.env.SECRET_COOKIE, // for cookies signature
  });
  app.enableCors({
    origin: [
      "http://192.168.1.202",
      "http://localhost:3000",
      process.env.CLIENT_ORIGIN as string,
      /https:\/\/.*\.lhr\.life$/
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // await app.register(fastifyCors as any, {
  //   origin: [
  //     process.env.CLIENT_ORIGIN as string,
  //     'http://localhost:1912', // ← Thêm FE local của bạn
  //   ],
  //   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  //   credentials: true,
  // });
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
       docExpansion: "none",
    },
  });

  await app.listen(3000);
  logger.log(
    chalk.cyanBright('[EZ CHECKIN]') + ' ' + chalk.green('START SUCCESS'),
  );
}
bootstrap();
