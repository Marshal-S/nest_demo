import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./req-user.dto";

export class TokenDto {
    @ApiProperty({description: 'token(需要放到 headers 中)', example: '112313ssdf'})
    accessToken: string

    @ApiProperty({description: '当accessToken过期时，使用该token更新token', example: '112313ssdf'})
    refreshToken: string

    @ApiProperty({ description: '用户信息', type: () => UserDto,  example: UserDto })
    user: UserDto
}