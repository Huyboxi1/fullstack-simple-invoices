import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "paul@101digital.io",
    description: "User email address",
  })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({ example: "password123", description: "User password" })
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  password: string;
}

export class UserDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "paul@101digital.io" })
  email: string;

  @ApiProperty({ example: "Paul" })
  fullname: string;
}
