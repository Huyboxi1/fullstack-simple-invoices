import { Controller, Get } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/health")
  @ApiResponse({ status: 200, description: "Service is alive" })
  getAlive(): string {
    return this.appService.getAlive();
  }
}
