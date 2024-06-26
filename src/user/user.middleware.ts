import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class UserMiddleware implements NestMiddleware {
	// use(req: Request, res: Response, next: NextFunction) {
    use(req: Request, res: any, next: NextFunction) {
        //假设我们要获取一个请求的开始或者结束时间
		//如果平时我们不需要，发现问题需要，我们也可以另起一个单例，直接使用一个接口设置标识，这里根据标识更新调整是否监听即可，以及请求时间间隔
		const maxRequestTime = 500 //假设设置的最大请求时间是500ms
        const startTime = new Date();
		const startString = startTime.toISOString()
		//如果开始日志不打的话，如果碰到死循环、递归的也没办法看到日志了，那种情况这里最好也打印
		// Logger.log(`start # url:${req.url}, startTime:${startString}}`);
        res.on('finish', () => {
			const interval = Date.now() - startTime.getTime()
			if (interval >= maxRequestTime) {
				Logger.log(`finish # url:${req.url}, duration:${Date.now() - startTime.getTime()} ms, startTime:${startString}}`);
			}
			// Logger.log(`finish # url:${req.url}, duration:${Date.now() - startTime.getTime()} ms, startTime:${startString}}`);
        });
        next();
    }
}
