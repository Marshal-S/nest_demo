import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Version,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { VersionService } from './version.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';
import { Public } from 'src/user/user.decorator';
import { ApiHeader, ApiOperation, ApiParam } from '@nestjs/swagger';

@Public()
@Controller('version')
// @Controller({
//     version: VERSION_NEUTRAL, //中立，在没有版本控制的路由上不需要拼接url了(主要针对于url版本)
// })
export class VersionController {
    constructor(private readonly versionService: VersionService) {}

    @Version('1')
    @Get('test')
    test1() {
        return '测试版本1';
    }

    @Version('2')
    @Get('test')
    test2() {
        return '测试版本2';
    }

    @Version(['1', '2'])
    @Get('test2')
    test3() {
        return '测试版本1-2';
    }

    @Get('v2/test2')
    superTest3() {
        return '强化版本v2';
    }
}
