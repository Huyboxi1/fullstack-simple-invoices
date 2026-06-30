import { createConnection, Connection } from "typeorm";
import * as bcrypt from "bcrypt";
import { User, Invoice, InvoiceItem } from "../../entities";
import { InvoiceStatus } from "../../invoices/constants/invoice-status.enum";

async function runSeed() {
  const connection: Connection = await createConnection({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "simple_invoice",
    entities: [User, Invoice, InvoiceItem],
    synchronize: false,
    logging: true,
  });

  console.log("Database connected. Starting seed...");

  const userRepository = connection.getRepository(User);
  let reviewer = await userRepository.findOne({
    where: { email: "reviewer@101digital.io" },
  });

  if (!reviewer) {
    const passwordHash = await bcrypt.hash("Reviewer@101", 10);
    reviewer = userRepository.create({
      email: "reviewer@101digital.io",
      passwordHash,
      fullname: "101 Digital Reviewer",
    });
    await userRepository.save(reviewer);
    console.log("Created default reviewer account.");
  }

  const invoiceRepository = connection.getRepository(Invoice);
  const statuses = [
    InvoiceStatus.DRAFT,
    InvoiceStatus.PENDING,
    InvoiceStatus.PAID,
  ];

  for (let i = 1; i <= 30; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const today = new Date();
    const invoiceDate = new Date(today);
    invoiceDate.setDate(today.getDate() - Math.floor(Math.random() * 30));

    const dueDate = new Date(invoiceDate);
    dueDate.setDate(
      invoiceDate.getDate() + (Math.floor(Math.random() * 60) - 15),
    );

    const invoice = invoiceRepository.create({
      invoiceNumber: `INV-SEED-${1000 + i}`,
      invoiceDate,
      dueDate,
      currency: "AUD",
      currencySymbol: "AU$",
      status,
      createdBy: reviewer,
      customerFullname: `Seed Customer ${i}`,
      customerEmail: `customer${i}@example.com`,
      invoiceSubTotal: 1000,
      totalTax: 100,
      totalDiscount: 0,
      totalAmount: 1100,
      totalPaid: status === InvoiceStatus.PAID ? 1100 : 0,
      balanceAmount: status === InvoiceStatus.PAID ? 0 : 1100,
      items: [{ name: "Consulting Services", quantity: 1, rate: 1000 }],
    });

    await invoiceRepository.save(invoice);
  }

  console.log("Seeded 30 invoices successfully!");
  await connection.close();
}

runSeed().catch((error) => console.error("Seeding failed:", error));
