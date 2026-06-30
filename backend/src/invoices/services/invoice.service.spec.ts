import { Test, TestingModule } from "@nestjs/testing";
import { InvoiceService } from "./invoice.service";
import { InvoiceRepository } from "../../repositories";
import { Connection, EntityManager } from "typeorm";
import {
  ConflictException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InvoiceStatus } from "../constants/invoice-status.enum";
import { Invoice } from "../../entities";

describe("InvoiceService", () => {
  let service: InvoiceService;
  let mockEntityManager: Partial<EntityManager>;
  let mockConnection: Partial<Connection>;
  let mockInvoiceRepository: Partial<InvoiceRepository>;

  const mockUser = { id: "user-123" } as any;

  beforeEach(async () => {
    // 1. Mock the EntityManager (used inside transactions)
    mockEntityManager = {
      findOne: jest.fn(),
      save: jest
        .fn()
        .mockImplementation((_entity, data) => Promise.resolve(data)),
    };

    // 2. Mock the Connection (used to start transactions)
    mockConnection = {
      transaction: jest.fn().mockImplementation(async (cb) => {
        return await cb(mockEntityManager); // Pass our mock manager to your transaction block
      }),
    };

    // 3. Mock the Repository (used in findAll and findOne)
    mockInvoiceRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        { provide: Connection, useValue: mockConnection },
        { provide: InvoiceRepository, useValue: mockInvoiceRepository },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create (Invoice Total Calculations & Unique Constraint)", () => {
    const validCreateDto: any = {
      invoiceNumber: "INV-001",
      invoiceDate: new Date("2026-06-29"),
      dueDate: new Date("2026-07-29"),
      currency: "USD",
      currencySymbol: "$",
      customerFullname: "John Doe",
      customerEmail: "john@example.com",
      tax: 10,
      discount: 10,
      items: [
        { name: "Item 1", quantity: 2, rate: 50 }, // Subtotal: 100
        { name: "Item 2", quantity: 1, rate: 200 }, // Subtotal: 200
      ], // Total Subtotal: 300. Tax(10%): 30. Discount: 10. Final: 320.
    };

    it("should throw ConflictException if invoice number is not unique", async () => {
      // Setup the mock to simulate finding an existing invoice
      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(new Invoice());

      await expect(service.create(validCreateDto, mockUser)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(validCreateDto, mockUser)).rejects.toThrow(
        "already exists",
      );
    });

    it("should throw BadRequestException if due date is before invoice date", async () => {
      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(null);

      const invalidDto = {
        ...validCreateDto,
        invoiceDate: new Date("2026-07-29"),
        dueDate: new Date("2026-06-29"), // Invalid: due before created
      };

      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should correctly calculate subTotal, tax, discount, and totalAmount", async () => {
      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.create(validCreateDto, mockUser);

      // Verify the calculations made in the service
      expect(result.invoiceSubTotal).toBe(300); // 2*50 + 1*200
      expect(result.totalTax).toBe(30); // 10% of 300
      expect(result.totalDiscount).toBe(10);
      expect(result.totalAmount).toBe(320); // 300 + 30 - 10
      expect(result.balanceAmount).toBe(320); // same as totalAmount
      expect(mockEntityManager.save).toHaveBeenCalled();
    });
  });

  describe("mapOverdueStatus (Overdue Status Derivation)", () => {
    it("should return Overdue if status is not PAID and due date is in the past", async () => {
      // Mock an invoice from the past
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      const mockInvoice = {
        invoiceId: "1",
        status: InvoiceStatus.DRAFT,
        dueDate: pastDate,
        createdBy: mockUser,
      } as Invoice;

      (mockInvoiceRepository.findOne as jest.Mock).mockResolvedValue(
        mockInvoice,
      );

      const result = await service.findOne("1");

      expect(result.status).toBe("Overdue");
    });

    it("should retain original status if the invoice is already PAID, even if past due", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      const mockInvoice = {
        invoiceId: "2",
        status: InvoiceStatus.PAID,
        dueDate: pastDate,
        createdBy: mockUser,
      } as Invoice;

      (mockInvoiceRepository.findOne as jest.Mock).mockResolvedValue(
        mockInvoice,
      );

      const result = await service.findOne("2");

      expect(result.status).toBe(InvoiceStatus.PAID);
    });

    it("should retain original status if due date is in the future", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      const mockInvoice = {
        invoiceId: "3",
        status: InvoiceStatus.PENDING,
        dueDate: futureDate,
        createdBy: mockUser,
      } as Invoice;

      (mockInvoiceRepository.findOne as jest.Mock).mockResolvedValue(
        mockInvoice,
      );

      const result = await service.findOne("3");

      expect(result.status).toBe(InvoiceStatus.PENDING);
    });
  });

  describe("findOne", () => {
    it("should throw NotFoundException if invoice does not exist", async () => {
      (mockInvoiceRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne("invalid-id")).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
