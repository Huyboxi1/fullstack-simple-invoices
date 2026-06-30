import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { InvoiceService } from "../services/invoice.service";
import { CreateInvoiceDto, GetInvoicesQueryDto } from "../dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UserDto } from "../../auth/dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("Invoices")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("invoices")
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: "Create a new invoice" })
  @ApiResponse({ status: 201, description: "Invoice successfully created." })
  @ApiResponse({ status: 400, description: "Bad Request (Validation Error)." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({
    status: 409,
    description: "Conflict (Invoice Number already exists).",
  })
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentUser() currentUser: UserDto,
  ) {
    return this.invoiceService.create(createInvoiceDto, currentUser);
  }

  @Get()
  @ApiOperation({
    summary: "List invoices with search, filter, sort, pagination",
  })
  @ApiResponse({
    status: 200,
    description: "Returns a paginated list of invoices.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findAll(@Query() query: GetInvoicesQueryDto) {
    return this.invoiceService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get invoice detail by ID" })
  @ApiResponse({ status: 200, description: "Returns the invoice details." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Invoice not found." })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.invoiceService.findOne(id);
  }
}
