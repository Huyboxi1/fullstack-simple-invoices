import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Invoice, InvoiceItem, User } from "../entities";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: "postgres",
          host: configService.get<string>("DB_HOST", "localhost"),
          port: Number(configService.get<number>("DB_PORT", 5432)),
          username: configService.get<string>("DB_USERNAME", "postgres"),
          password: configService.get<string>("DB_PASSWORD", "password"),
          database: configService.get<string>("DB_DATABASE", "postgres"),
          entities: [User, Invoice, InvoiceItem],
          synchronize:
            configService.get<string>("SYNCHRONIZE", "false") === "true",
        };
      },
    }),
  ],
})
export class DatabaseModule {}
