import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'That\'s right! It turned out that I am working!';
  }

  getAlive(): string {
    return "alive";
  }
}
