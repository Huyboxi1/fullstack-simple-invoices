import { InvoiceItem } from "../entities/invoice-item.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(InvoiceItem)
export class InvoiceItemRepository extends Repository<InvoiceItem> {}
