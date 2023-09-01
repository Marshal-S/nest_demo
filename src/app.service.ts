import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  
  getHello(): string {
    return '欢迎来到nestjs demo!';
  }

}
