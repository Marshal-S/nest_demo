import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Order]), forwardRef(() => UserModule)],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService], 
})
export class OrderModule {}
