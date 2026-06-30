import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  IsInt,
  ValidateNested,
  IsArray,
  ArrayMinSize,
} from "class-validator";
import { Type } from "class-transformer";
import { IsOnOrAfterDate } from "../../common/validators/is-on-or-after-date.validator";

export class InvoiceItemDto {
  @ApiProperty({ example: "Web Development Services" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: "Positive integer" })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 1500.0, description: "Positive number" })
  @IsNumber()
  @Min(0.01)
  rate: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: "Paul" })
  @IsString()
  @IsNotEmpty({ message: "Customer name is required" })
  customerFullname: string;

  @ApiProperty({ example: "paul@101digital.io" })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty()
  customerEmail: string;

  @ApiPropertyOptional({ example: "+6591234567" })
  @IsString()
  @IsOptional()
  customerMobileNumber?: string;

  @ApiPropertyOptional({ example: "Singapore" })
  @IsString()
  @IsOptional()
  customerAddress?: string;

  @ApiProperty({ example: "INV-2026-001" })
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @ApiProperty({ example: "2026-06-03" })
  @IsDateString()
  @IsNotEmpty()
  invoiceDate: string;

  @ApiProperty({ example: "2026-07-03" })
  @IsDateString()
  @IsNotEmpty()
  @IsOnOrAfterDate("invoiceDate")
  dueDate: string;

  @ApiProperty({ example: "AUD", description: "ISO 4217 Currency Code" })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: "AU$" })
  @IsString()
  @IsNotEmpty()
  currencySymbol: string;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: "Tax percentage",
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  tax: number = 10;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount: number = 0;

  @ApiProperty({ type: [InvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];
}
