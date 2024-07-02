import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

//一个请求相应超过 500ms 的就给出log
@Injectable()
export class AppMiddleware implements NestMiddleware {
    use(req: Request, res: any, next: NextFunction) {
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
        });
        next();
    }
}
