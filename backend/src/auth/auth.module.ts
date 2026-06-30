import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { JwtStrategy } from "./strategies/jwt.strategy";
import { RepositoryModule } from "../repositories/repository.module";
import { AuthController } from "./controllers";
import { AuthService } from "./services";

@Module({
  imports: [
    RepositoryModule,

    PassportModule.register({ defaultStrategy: "jwt" }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwtSecret =
          configService.get<string>("JWT_SECRET") || "default_secret_key_123";

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: configService.get<string | number>(
              "JWT_EXPIRES_IN",
              "3600s",
            ),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule, JwtStrategy],
})
export class AuthModule {}
