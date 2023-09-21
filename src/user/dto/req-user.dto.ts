import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, Validate, isNumber } from "class-validator";
import { IsMoney } from "../user.validate";

export class UserDto {
    //api属性备注，必填
    @ApiProperty({description: '名字', example: '迪丽热巴'})
    //设置了 IsNotEmpty 就是必填属性了，文档也会根据该验证来显示是否必填
    @IsNotEmpty({ message: 'nickname不能为空' })//可以返回指定message，返回为数组
    // @IsNotEmpty()//返回默认message，默认为为原字段的英文提示
    readonly nickname: string

    //可选参数
    @ApiPropertyOptional({description: '年龄', example: 20})
    readonly age: number

    @ApiPropertyOptional({description: '手机号', example: '133****3333'})
    readonly mobile: string

    @ApiPropertyOptional({description: '性别 1男 2女 0未知', example: 1})
    @Min(0)
    @Max(1)
    readonly sex: number
}

export class LoginDto {
    @ApiProperty({ description: '用户名', example: '12222222222'})
    @IsNotEmpty()
    account: string

    @ApiProperty({ description: '密码', example: '111111'})
    @IsNotEmpty()
    password: string
}

export class UserUpdateDto {
    //api属性备注，必填
    @ApiProperty({description: '名字', example: '迪丽热巴'})
    readonly nickname: string

    //可选参数
    @ApiPropertyOptional({description: '年龄', example: 20})
    readonly age: number

    @ApiPropertyOptional({description: '手机号', example: '133****3333'})
    readonly mobile: string

    @ApiProperty({description: '性别 1男 2女 0未知', example: 1})
    @Min(0)
    @Max(2)
    readonly sex: number

    @ApiProperty({ description: '收入' })
    @IsOptional()
    @Validate(IsMoney)
    readonly income: string
}

