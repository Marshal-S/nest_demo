import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {
    constructor(private configService: ConfigService) {
        console.log(this.configService);
    }

    getHello(): string {
        return '欢迎来到nestjs demo!';
    }
}
