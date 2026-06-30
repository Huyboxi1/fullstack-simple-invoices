import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { DatabaseModule } from "./database";
import { RepositoryModule } from "./repositories/repository.module";
import { AuthModule } from "./auth/auth.module";
import { InvoiceModule } from "./invoices/invoice.module";
import { ResponseInterceptor } from "./common/interceptors";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>("THROTTLE_TTL", 60),
        limit: config.get<number>("THROTTLE_LIMIT", 100),
      }),
    }),
    DatabaseModule,
    RepositoryModule,
    AuthModule,
    InvoiceModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
