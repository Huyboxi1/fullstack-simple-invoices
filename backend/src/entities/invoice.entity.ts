import { NumericTransformer } from "../common/transformers/numeric.transformer";
import { InvoiceStatus } from "../invoices/constants/invoice-status.enum";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { InvoiceItem } from "./invoice-item.entity";

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  invoiceId: string;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column({ nullable: true })
  invoiceReference: string;

  @Column({ type: "date" })
  invoiceDate: Date;

  @Column({ type: "date" })
  dueDate: Date;

  @Column()
  currency: string;

  @Column({ name: "currency_symbol" })
  currencySymbol: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    default: 0,
    transformer: new NumericTransformer(),
  })
  invoiceSubTotal: number;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    default: 0,
    transformer: new NumericTransformer(),
  })
  totalTax: number;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    default: 0,
    transformer: new NumericTransformer(),
  })
  totalDiscount: number;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    default: 0,
    transformer: new NumericTransformer(),
  })
  totalAmount: number;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    default: 0,
    transformer: new NumericTransformer(),
  })
  totalPaid: number;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    default: 0,
    transformer: new NumericTransformer(),
  })
  balanceAmount: number;

  @Column({ name: "customer_fullname" })
  customerFullname: string;

  @Column({ name: "customer_email" })
  customerEmail: string;

  @Column({ name: "customer_mobile_number", nullable: true })
  customerMobileNumber: string;

  @Column({ name: "customer_address", type: "text", nullable: true })
  customerAddress: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @ManyToOne(
    () => User,
    (user) => user.invoices,
    { onDelete: "SET NULL" },
  )
  @JoinColumn({ name: "created_by" })
  createdBy: User;

  @OneToMany(
    () => InvoiceItem,
    (item) => item.invoice,
    { cascade: true },
  )
  items: InvoiceItem[];

  get calculatedStatus(): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const invoiceDueDate = new Date(this.dueDate);
    invoiceDueDate.setHours(0, 0, 0, 0);

    if (this.status !== InvoiceStatus.PAID && invoiceDueDate < today) {
      return "Overdue";
    }
    return this.status;
  }
}
