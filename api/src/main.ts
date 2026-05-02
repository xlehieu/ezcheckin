import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import chalk from 'chalk';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import * as dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  // 1. Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('EZCheckin API') // Tên dự án của bạn
    .setDescription('Tài liệu API cho hệ thống chấm công bằng mã QR')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  app.use(
    session({
      secret: process.env.SECRET_SESSION, // Dùng env variable
      resave: false, // có lưu vào db nếu có thay đổi, true là lưu vào db mọi request
      saveUninitialized: false, // chỉ lưu khi có dữ liệu
      store: new MongoStore({
        mongoUrl: process.env.MONGODB_URI,
      }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: false, // Đặt true nếu dùng HTTPS
      },
    }),
  );
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
