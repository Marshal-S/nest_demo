import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { APIResponse } from 'src/request/response';
import { Public } from 'src/user/user.decorator';

@ApiTags('订单')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @ApiOperation({
        summary: '创建两种流水号的订单',
    })
    @Public()
    @APIResponse()
    @Post('create')
    create() {
        // return this.orderService.create();
        return this.orderService.createEx() 
    }
}
