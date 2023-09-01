import { Headers, SetMetadata, UseGuards } from '@nestjs/common';
import { UserGuard } from './user.guard';
import { PublicStatus } from './user.enum';

//是否公开，设置该装饰器，可以避免jwt的校验
export const PUBLIC_KEY = '__public_key';
//默认的公共没有token，也不会获得用户数据，可以设置状态
export const Public = () => SetMetadata(PUBLIC_KEY, PublicStatus.default);
//默认带token的，有user返回user
export const PublicUser = () => SetMetadata(PUBLIC_KEY, PublicStatus.token);

//手动校验
export const Guards = () => UseGuards(UserGuard)

//设置一个key，方便快速通过装饰器获取用户信息，在jwt验证时存入，这里获取
export const USER_ID_KEY  = '__user_id_key';
export const ReqUserId = () => Headers(USER_ID_KEY);

//如果保存的是 user 则可以用这个
export const USER_KEY  = '__user_key';
export const ReqUser = () => Headers(USER_KEY);