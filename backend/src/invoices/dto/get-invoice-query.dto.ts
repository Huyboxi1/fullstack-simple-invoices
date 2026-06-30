import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsIn,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

export class GetInvoicesQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @ApiPropertyOptional({ enum: ["invoiceDate", "dueDate", "totalAmount"] })
  @IsOptional()
  @IsIn(["invoiceDate", "dueDate", "totalAmount"])
  sortBy?: string;

  @ApiPropertyOptional({ enum: ["ASC", "DESC"] })
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  ordering?: "ASC" | "DESC";

  @ApiPropertyOptional({ enum: ["Draft", "Pending", "Paid", "Overdue"] })
  @IsOptional()
  @IsIn(["Draft", "Pending", "Paid", "Overdue"])
  status?: string;

  @ApiPropertyOptional({
    description: "Search by invoice number or customer name",
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ example: "2026-01-01" })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ example: "2026-12-31" })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
