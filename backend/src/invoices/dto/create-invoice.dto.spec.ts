import { validate, ValidationError } from "class-validator";
import { CreateInvoiceDto, InvoiceItemDto } from "./create-invoice.dto";

describe("CreateInvoiceDto Validation", () => {
  const createValidPayload = (): CreateInvoiceDto => {
    const dto = new CreateInvoiceDto();
    dto.customerFullname = "Paul";
    dto.customerEmail = "paul@101digital.io";
    dto.invoiceNumber = "INV-2026-001";
    dto.invoiceDate = "2026-06-03";
    dto.dueDate = "2026-07-03";
    dto.currency = "AUD";
    dto.currencySymbol = "AU$";
    dto.tax = 10;
    dto.discount = 0;

    const item = new InvoiceItemDto();
    item.name = "Web Development Services";
    item.quantity = 1;
    item.rate = 1500.0;

    dto.items = [item];
    return dto;
  };

  const getValidationError = (
    errors: ValidationError[],
    property: string,
  ): ValidationError => {
    const error = errors.find((entry) => entry.property === property);
    expect(error).toBeDefined();

    if (!error) {
      throw new Error(`Expected validation error for property: ${property}`);
    }

    return error;
  };

  it("should validate successfully with an entirely valid payload", async () => {
    const dto = createValidPayload();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe("Customer Fields Validation", () => {
    it("should fail validation if customerFullname is empty", async () => {
      const dto = createValidPayload();
      dto.customerFullname = "";

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const targetError = getValidationError(errors, "customerFullname");
      expect(targetError.constraints?.isNotEmpty).toBe(
        "Customer name is required",
      );
    });

    it("should fail validation if customerEmail format is invalid", async () => {
      const dto = createValidPayload();
      dto.customerEmail = "invalid-email-format";

      const errors = await validate(dto);
      const targetError = getValidationError(errors, "customerEmail");

      expect(targetError.constraints?.isEmail).toBe("Invalid email format");
    });
  });

  describe("Due Date Validation Logic", () => {
    it("should fail validation if dueDate is physically before invoiceDate", async () => {
      const dto = createValidPayload();
      dto.invoiceDate = "2026-06-10";
      dto.dueDate = "2026-06-05"; // Invalid: 5 days before invoice date

      const errors = await validate(dto);
      const targetError = getValidationError(errors, "dueDate");

      // Verifies your custom validator constraint blocks it
      expect(targetError.constraints?.isOnOrAfterDate).toBeDefined();
    });

    it("should pass validation if dueDate is exactly equal to invoiceDate", async () => {
      const dto = createValidPayload();
      dto.invoiceDate = "2026-06-10";
      dto.dueDate = "2026-06-10"; // Valid: On or after constraint met

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe("Nested Items Arrays Validation", () => {
    it("should fail validation if the items array is empty", async () => {
      const dto = createValidPayload();
      dto.items = []; // Invalid: ArrayMinSize(1) violation

      const errors = await validate(dto);
      const targetError = getValidationError(errors, "items");

      expect(targetError.constraints?.arrayMinSize).toBeDefined();
    });

    it("should fail validation if a nested item contains an invalid rate or quantity", async () => {
      const dto = createValidPayload();

      // Setup structural failure within sub-dto item
      dto.items[0].quantity = 0; // Invalid: Min(1)
      dto.items[0].rate = -100; // Invalid: Min(0.01)

      const errors = await validate(dto);

      // Nested validation failures report within 'children' property arrays
      const targetError = getValidationError(errors, "items");
      expect(targetError.children?.length).toBeGreaterThan(0);

      const nestedItemErrors = targetError.children?.[0]?.children ?? [];
      const quantityError = nestedItemErrors.find(
        (e: ValidationError) => e.property === "quantity",
      );
      const rateError = nestedItemErrors.find(
        (e: ValidationError) => e.property === "rate",
      );

      expect(quantityError?.constraints?.min).toBeDefined();
      expect(rateError?.constraints?.min).toBeDefined();
    });
  });
});
