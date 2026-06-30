import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Connection, EntityManager, Between, ILike } from "typeorm";
import { InvoiceRepository } from "../../repositories";
import { CreateInvoiceDto, GetInvoicesQueryDto } from "../dto";
import { UserDto } from "../../auth/dto";
import { Invoice, InvoiceItem, User } from "../../entities";
import { InvoiceStatus } from "../constants/invoice-status.enum";

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly connection: Connection,
  ) {}

  async create(
    createInvoiceDto: CreateInvoiceDto,
    currentUser: UserDto,
  ): Promise<Invoice> {
    return this.connection.transaction(async (manager: EntityManager) => {
      const exists = await manager.findOne(Invoice, {
        where: { invoiceNumber: createInvoiceDto.invoiceNumber },
      });

      if (exists) {
        throw new ConflictException(
          `Invoice number ${createInvoiceDto.invoiceNumber} already exists`,
        );
      }

      const invoiceDate = new Date(createInvoiceDto.invoiceDate);
      const dueDate = new Date(createInvoiceDto.dueDate);
      if (dueDate < invoiceDate) {
        throw new BadRequestException(
          "Due date must be on or after invoice date",
        );
      }

      const invoice = new Invoice();
      invoice.invoiceNumber = createInvoiceDto.invoiceNumber;
      invoice.invoiceDate = invoiceDate;
      invoice.dueDate = dueDate;
      invoice.currency = createInvoiceDto.currency;
      invoice.currencySymbol = createInvoiceDto.currencySymbol;
      invoice.status = InvoiceStatus.DRAFT;

      invoice.createdBy = { id: currentUser.id } as User;

      invoice.customerFullname = createInvoiceDto.customerFullname;
      invoice.customerEmail = createInvoiceDto.customerEmail;
      if (createInvoiceDto.customerMobileNumber) {
        invoice.customerMobileNumber = createInvoiceDto.customerMobileNumber;
      }
      if (createInvoiceDto.customerAddress) {
        invoice.customerAddress = createInvoiceDto.customerAddress;
      }

      let subTotal = 0;
      const itemsToSave: InvoiceItem[] = [];

      for (const itemDto of createInvoiceDto.items) {
        const itemSubTotal = itemDto.quantity * itemDto.rate;
        subTotal += itemSubTotal;

        const item = new InvoiceItem();
        item.name = itemDto.name;
        item.quantity = itemDto.quantity;
        item.rate = itemDto.rate;
        itemsToSave.push(item);
      }

      const taxRate =
        createInvoiceDto.tax !== undefined ? createInvoiceDto.tax : 10;
      const discountAmount = createInvoiceDto.discount || 0;

      const taxAmount = subTotal * (taxRate / 100);
      const totalAmount = subTotal + taxAmount - discountAmount;

      invoice.invoiceSubTotal = subTotal;
      invoice.totalTax = taxAmount;
      invoice.totalDiscount = discountAmount;
      invoice.totalAmount = totalAmount;
      invoice.totalPaid = 0;
      invoice.balanceAmount = totalAmount;
      invoice.items = itemsToSave;

      const savedInvoice = await manager.save(Invoice, invoice);

      return this.mapOverdueStatus(savedInvoice);
    });
  }

  async findAll(query: GetInvoicesQueryDto) {
    const {
      page = 1,
      pageSize = 10,
      sortBy,
      ordering = "DESC",
      status,
      keyword,
      fromDate,
      toDate,
    } = query;

    const skip = (page - 1) * pageSize;
    const whereConditions: any = {};

    if (fromDate && toDate) {
      whereConditions.invoiceDate = Between(fromDate, toDate);
    } else if (fromDate) {
      whereConditions.invoiceDate = Between(fromDate, "2999-12-31");
    } else if (toDate) {
      whereConditions.invoiceDate = Between("1970-01-01", toDate);
    }

    let searchConditions: any[] = [];
    if (keyword) {
      searchConditions = [
        { ...whereConditions, invoiceNumber: ILike(`%${keyword}%`) },
        { ...whereConditions, customerFullname: ILike(`%${keyword}%`) },
      ];
    } else {
      searchConditions.push(whereConditions);
    }

    if (status) {
      const todayStr = new Date().toISOString().split("T")[0];

      searchConditions = searchConditions.map((cond) => {
        if (status === "Overdue") {
          return {
            ...cond,
            status: Between(InvoiceStatus.DRAFT, InvoiceStatus.PENDING),
            dueDate: Between("1970-01-01", todayStr),
          };
        } else {
          const cleanCond: any = { ...cond, status: status as InvoiceStatus };
          if (status !== InvoiceStatus.PAID) {
            cleanCond.dueDate = Between(todayStr, "2999-12-31");
          }
          return cleanCond;
        }
      });
    }

    const orderCondition: any = {};
    if (sortBy) {
      orderCondition[sortBy] = ordering;
    } else {
      orderCondition.createdAt = "DESC";
    }

    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where: searchConditions,
      order: orderCondition,
      take: pageSize,
      skip: skip,
      relations: ["items"],
    });

    const mappedData = invoices.map((invoice) =>
      this.mapOverdueStatus(invoice),
    );

    return {
      data: mappedData,
      paging: {
        page,
        pageSize,
        total,
      },
    };
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { invoiceId: id },
      relations: ["items", "createdBy"],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID "${id}" not found`);
    }

    return this.mapOverdueStatus(invoice);
  }

  private mapOverdueStatus(invoice: Invoice): any {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const invoiceDueDate = new Date(invoice.dueDate);
    invoiceDueDate.setHours(0, 0, 0, 0);

    let displayStatus: string = invoice.status;

    if (invoice.status !== InvoiceStatus.PAID && invoiceDueDate < today) {
      displayStatus = "Overdue";
    }

    return {
      ...invoice,
      status: displayStatus,
      createdBy: invoice.createdBy?.id ?? null,
    };
  }
}
