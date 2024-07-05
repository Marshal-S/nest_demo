import { Inject, Injectable } from '@nestjs/common';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { ConfigType } from './config.module';

@Injectable()
export class ConfigService {
    constructor(@Inject('CONFIG_OPTIONS') private config: ConfigType) {}

    create(createConfigDto: CreateConfigDto) {
        return 'This action adds a new config';
    }

    findAll() {
        return `This action returns all config`;
    }

    findOne(id: number) {
        return `This action returns a #${id} config`;
    }

    update(id: number, updateConfigDto: UpdateConfigDto) {
        return `This action updates a #${id} config`;
    }

    remove(id: number) {
        return `This action removes a #${id} config`;
    }
}
