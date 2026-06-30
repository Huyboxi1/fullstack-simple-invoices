import { Invoice } from "../entities/invoice.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice> {}
