import { InvoiceItem } from "../entities/invoice-item.entity";
import { Invoice } from "../entities/invoice.entity";
import { User } from "../entities/user.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoiceItemRepository } from "./invoice-item.repository";
import { InvoiceRepository } from "./invoice.repository";
import { UserRepository } from "./user.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      InvoiceItem,
      User,
      InvoiceRepository,
      InvoiceItemRepository,
      UserRepository,
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class RepositoryModule {}
