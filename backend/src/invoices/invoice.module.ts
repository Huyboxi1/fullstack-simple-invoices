import { Logger, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { RepositoryModule } from "../repositories";
import { AuthModule } from "../auth";

import { InvoiceController } from "./controllers/invoice.controller";
import { InvoiceService } from "./services/invoice.service";

@Module({
  imports: [RepositoryModule, HttpModule, AuthModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, Logger],
  exports: [InvoiceService],
})
export class InvoiceModule {}
