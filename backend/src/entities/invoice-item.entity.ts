import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Invoice } from "./invoice.entity";
import { NumericTransformer } from "../common/transformers/numeric.transformer";

@Entity("invoice_items")
export class InvoiceItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    () => Invoice,
    (invoice) => invoice.items,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "invoice_id" })
  invoice: Invoice;

  @Column()
  name: string;

  @Column({ type: "integer" })
  quantity: number;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  rate: number;
}
