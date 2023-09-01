import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码

    let message: string;
    let code: number;
    if (status === 401) {
      code = status;
      message = '未授权';
    }else {
      code = -1;
      message = exception.message
      // message = '网络请求失败';
    }
    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    // response.header('Content-Type', 'application/json; charset=utf-8');
    response.send({
      msg: message,
      code,
    });
  }
}