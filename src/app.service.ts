import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { ConfigType } from 'dayjs';

@Injectable()
export class AppService {
    getHello(): string {
        return '欢迎来到nestjs demo!';
    }
}
