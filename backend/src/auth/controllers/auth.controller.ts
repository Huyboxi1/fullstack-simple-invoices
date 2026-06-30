import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "../services/auth.service";
import { LoginDto, UserDto } from "../dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Authenticate user and return JWT access token" })
  @ApiResponse({
    status: 200,
    description: "Successfully authenticated. Returns JSON Web Token.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request. Payload failed validation rules.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. Invalid email address or password.",
  })
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Return current authenticated user profile" })
  @ApiResponse({
    status: 200,
    description: "Returns the logged-in user profile details.",
    type: UserDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. Token is missing, invalid, or expired.",
  })
  async getProfile(@CurrentUser() currentUser: UserDto): Promise<UserDto> {
    return this.authService.getProfile(currentUser);
  }
}
