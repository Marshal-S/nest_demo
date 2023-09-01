import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('global')
@Controller('global')
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  hello() {
    return this.appService.getHello()
  }
}
