import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PUBLIC_KEY, Public, USER_ID_KEY, USER_KEY } from './user.decorator';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './service/user.service';
import { Reflector } from '@nestjs/core';
import { envConfig } from 'src/app.config';
import { PublicStatus } from './user.enum';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean {
    //测试专用
    const publicStatus = this.reflector.getAllAndOverride<PublicStatus>(
      PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (publicStatus === PublicStatus.default) {
      //默认公开不往后走了
      return true
    }
    //剩下的都需要校验，publictoken的可以通过
    //获取请求，并校验token
    const request = context.switchToHttp().getRequest();
    let headers = request.headers
    const token = headers.token
    if (token) {
      //验证token或解码获取信息
      try {
        let user = this.jwtService.verify(token, {
          secret: envConfig.secret,
        });
        if (user?.id) {
          //设置一个黑名单功能，设置未授权，让重新登录
          if (this.userService.blackSet.has(user.id)) {
            throw new UnauthorizedException();
          }
          // token验证后，获取用户信息，避免用户不存在了(被删除、封号)还能继续使用的情况，可以设置维护黑、白名单之类的
          // 然后根据 token 的期限，定时清理黑白名单即可
          headers[USER_KEY] = user; //保存不变的用户令牌信息，可能不只是id，后续用户操作用这个会方便很多
          // headers[USER_ID_KEY] = id; //也可以直接保存用户id，用户操作会经常用到
          return true
        }
      } catch(err) {
        //如果过期，会出现这个额外参数，如果不是我们预先想的那样会出现其他错误
        //因此不是过期情况，我们给出403禁止，否则走后面的过期或者通过
        if (!err.expiredAt) {
          return false
        }
      }
    }
    if (publicStatus) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
