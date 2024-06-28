import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Like, Repository } from 'typeorm';
const dayjs = require('dayjs');
import { ResponseData } from 'src/request/response-data';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private orderRepository: Repository<Order>,
    ) {}

    async create() {
        //这里假设流水号以 OM 开头
        const order = new Order();
        order.name = '订单' + dayjs().valueOf();
        //处理没有日期的流水号，默认5为数字，如果超出后自动在前方补位
        //按照降序查找第一个，就是最大流水号，流水号又不能重复，所以成功后会自增
        const cOrder = await this.orderRepository.findOne({
            select: ['code'],
            where: {
                code: Like('OM%'),
            },
            order: {
                code: 'DESC',
            },
        });
        let newCode: string;
        if (cOrder) {
            const num = cOrder.code.substring(2, cOrder.code.length);
            newCode = num
                ? String(parseInt(num) + 1).padStart(5, '0')
                : '00001';
            console.log('newCode', newCode);
        } else {
            newCode = '00001';
        }
        order.code = `OM${newCode}`;
        console.log(order.code);

        //处理有日期且精确到日的流水号，默认3为数字，如果超出后自动在前方补位
        //仍然是按照降序查找第一个，就是最大流水号，流水号又不能重复，所以成功后会自增
        //需要注意的是，需要对比时间，如果时间到了第二日，则重头开始
        //时间戳8位，我们设置成8位
        const now = dayjs.utc().add(32, 'hour');
        const nowStr = now.format('YYYYMMDD');
        //直接查找当天中最大的，也可以避免有手动填写到第二天的bug
        const cxOrder = await this.orderRepository.findOne({
            select: ['code_ex'],
            where: {
                code_ex: Like(`OM${nowStr}%`),
            },
            order: {
                code_ex: 'DESC',
            },
        });
        let codeExNum: string;
        if (cxOrder) {
            const num = cxOrder.code_ex.substring(10, cxOrder.code_ex.length);
            codeExNum = num
                ? String(parseInt(num) + 1).padStart(3, '0')
                : '001';
            console.log('codeExNum', codeExNum);
        } else {
            codeExNum = '001';
        }
        order.code_ex = `OM${nowStr}${codeExNum}`;
        console.log(order.code_ex);
        await this.orderRepository.save(order);
        return ResponseData.ok();
    }

    async createEx() {
        //这里假设流水号以 OM 开头
        const order = new Order();
        order.name = '订单' + dayjs().valueOf();

        //处理没有日期的流水号，默认5为数字，如果超出后自动在前方补位
        //按照降序查找第一个，就是最大流水号，流水号又不能重复，所以成功后会自增
        //有了索引，能够快速帮我们查询出最大的那个值
        const cOrder = await this.orderRepository
            .createQueryBuilder('order')
            .select('MAX(order.code)', 'code')
            .getRawOne();
        let newCode: string;
        if (cOrder) {
            const num = cOrder.code.substring(2, cOrder.code.length);
            newCode = num
                ? String(parseInt(num) + 1).padStart(5, '0')
                : '00001';
            console.log('newCode', newCode);
        } else {
            newCode = '00001';
        }
        order.code = `OM${newCode}`;
        console.log(order.code);

        //处理有日期且精确到日的流水号，默认3为数字，如果超出后自动在前方补位
        //仍然是按照降序查找第一个，就是最大流水号，流水号又不能重复，所以成功后会自增
        //需要注意的是，需要对比时间，如果时间到了第二日，则重头开始
        //时间戳8位，我们设置成8位
        const now = dayjs.utc().add(32, 'hour');
        const nowStr = now.format('YYYYMMDD');
        //直接查找当天中最大的，也可以避免有手动填写到第二天的bug
        //如果有了索引，能够快速帮我们查询出最大的那个值
        const cxOrder = await this.orderRepository
            .createQueryBuilder('order')
            .select('MAX(order.code_ex)', 'code_ex')
            .getRawOne();
        let codeExNum: string;
        if (cxOrder) {
            const num = cxOrder.code_ex.substring(10, cxOrder.code_ex.length);
            codeExNum = num
                ? String(parseInt(num) + 1).padStart(3, '0')
                : '001';
            console.log('codeExNum', codeExNum);
        } else {
            codeExNum = '001';
        }
        order.code_ex = `OM${nowStr}${codeExNum}`;
        console.log(order.code_ex);
        await this.orderRepository.save(order);
        return ResponseData.ok();
    }
}
