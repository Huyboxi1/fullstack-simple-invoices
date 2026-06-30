import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import * as bcrypt from "bcrypt";
import { Connection } from "typeorm";
import { AppModule } from "./../src/app.module";
import { User } from "./../src/entities";

describe("Invoice Workflow (e2e)", () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.init();

    const connection = moduleFixture.get(Connection);
    const userRepository = connection.getRepository(User);

    const existingUser = await userRepository.findOne({
      where: { email: "e2e@example.com" },
    });

    if (!existingUser) {
      const passwordHash = await bcrypt.hash("Password123!", 10);
      await userRepository.save(
        userRepository.create({
          email: "e2e@example.com",
          passwordHash,
          fullname: "E2E Tester",
        }),
      );
    }

    const loginResponse = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "e2e@example.com",
        password: "Password123!",
      })
      .expect(200);

    authToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it("should complete the full workflow: create an invoice and verify its appearance in the list", async () => {
    const invoiceNumber = `E2E-INV-${Date.now()}`;
    const createPayload = {
      customerFullname: "E2E Customer",
      customerEmail: "customer@example.com",
      currency: "AUD",
      currencySymbol: "AU$",
      invoiceNumber,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      tax: 10,
      discount: 0,
      items: [
        {
          name: "Consulting Services",
          quantity: 1,
          rate: 500,
        },
      ],
    };

    const createResponse = await request(app.getHttpServer())
      .post("/invoices")
      .set("Authorization", `Bearer ${authToken}`)
      .send(createPayload)
      .expect(201);

    expect(createResponse.body.data.invoiceNumber).toEqual(invoiceNumber);
    expect(createResponse.body.data.status).toEqual("Draft");

    const getResponse = await request(app.getHttpServer())
      .get("/invoices")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(getResponse.body).toHaveProperty("data");
    expect(getResponse.body.data).toHaveProperty("data");
    expect(getResponse.body.data).toHaveProperty("paging");
    expect(Array.isArray(getResponse.body.data.data)).toBeTruthy();

    const createdInvoiceInList = getResponse.body.data.data.find(
      (inv: { invoiceNumber: string; totalAmount: number }) =>
        inv.invoiceNumber === invoiceNumber,
    );

    expect(createdInvoiceInList).toBeDefined();
    expect(createdInvoiceInList.totalAmount).toEqual(550);
  });
});
