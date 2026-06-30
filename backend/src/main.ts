import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express";
import helmet from "helmet";
import compression from "compression";
import { GlobalExceptionFilter } from "./common/filters";

interface RequestWithRawBody extends express.Request {
  rawBody: string;
}

const rawBodyBuffer = (
  req: RequestWithRawBody,
  _res: express.Response,
  buffer: Buffer,
  encoding: BufferEncoding,
) => {
  if (buffer && buffer.length) {
    req.rawBody = buffer.toString(encoding || "utf8");
  }
};

const extractValidationMessages = (errors: ValidationError[]): string[] => {
  return errors.flatMap((error) => {
    const messages: string[] = [];
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }
    if (error.children && error.children.length > 0) {
      messages.push(...extractValidationMessages(error.children));
    }
    return messages;
  });
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableShutdownHooks();

  app.setGlobalPrefix("api");

  app.use(express.json({ verify: rawBodyBuffer, limit: "50mb" }));
  app.use(
    express.urlencoded({
      verify: rawBodyBuffer,
      limit: "50mb",
      extended: true,
    }),
  );
  app.use(compression());
  app.enableCors();
  app.use(
    helmet({ crossOriginResourcePolicy: false, contentSecurityPolicy: false }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = extractValidationMessages(errors);

        return new BadRequestException(
          messages.length > 0 ? messages : ["Validation failed"],
        );
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  // Configuration
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>("PORT", 3000);
  const APP_ENV = configService.get<string>("APP_ENV", "development");

  if (["local", "development", "qa"].includes(APP_ENV)) {
    const config = new DocumentBuilder()
      .setTitle("Simple Invoice APIs Docs")
      .setDescription("All APIs used for the Frontend")
      .setVersion("1.0")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
  }

  await app.listen(PORT);
  console.log(`APP_ENV: ${APP_ENV}`);
  console.log(`Backend running on: http://localhost:${PORT}`);
  console.log(`Swagger Docs on: http://localhost:${PORT}/api/docs`);
}

bootstrap().catch(console.error);
