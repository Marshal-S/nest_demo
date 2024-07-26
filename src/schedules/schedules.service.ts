import { Injectable } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class SchedulesService {
    constructor(private schedulerRegistry: SchedulerRegistry) {
        // this.addCronJob('dynamic_cron_job', '*/2 * * * * *');
        // this.addInterval('dynami_interval_job', 1000);
        // this.addTimeout('dynami_timeout_job', 3000);
    }

    //假设某一天12点整执行一次
    // @Cron('0 0 12 * * *', {
    //     name: 'wxchat_appy_remind',
    //     timeZone: 'Asia/Shanghai', //时区，设置时区，和下面的utcOffset二选一
    //     // utcOffset: 8 * 60, //根据utc偏移精确到分
    //     //disable: true, //可以设置默认不启用，后续启用
    // })
    @Cron('0 0 17 * * *', { name: 'wxchat_appy_remind' })
    async remindUsers() {
        console.log('123');
    }

    //单位ms,每间隔指定ms运行一次
    // @Interval(5000)
    @Interval('test_interval_task', 200000)
    async intervalTask() {
        console.log('text_interval');
    }

    //单位ms,间隔指定ms执行一次结束
    // @Timeout(3000)
    @Timeout('test_timeout', 800000)
    handleTimeout() {
        console.log('test_time_out');
        //我们在这里停掉上面的Cron，前面的定时任务实际也一样
        const job = this.schedulerRegistry.getCronJob('wxchat_appy_remind'); //找不到直接抛出异常
        job.stop(); //停止声明的的任务
        // job.start(); //如果开始其disable状态，可以通过start启用
        // this.schedulerRegistry.deleteCronJob('wxchat_appy_remind'); //删除定时任务

        // const interval = this.schedulerRegistry.getInterval('test_interval_task');
        // clearInterval(interval)
        // this.schedulerRegistry.deleteInterval('test_interval_task'); //删除该 interval，删除后自然不会执行

        // const timeout = this.schedulerRegistry.getTimeout('test_timeout');
        // clearTimeout(timeout);
        // this.schedulerRegistry.deleteTimeout('test_timeout'); //删除该 interval，删除后自然不会执行

        // const dynamicJob =
        //     this.schedulerRegistry.getCronJob('dynamic_cron_job'); //找不到直接抛出异常
        // dynamicJob.start(); //启动，这个动态创建的无法停止，直接delete清理即可
        // this.schedulerRegistry.deleteCronJob('dynamic_cron_job');

        // this.schedulerRegistry.deleteInterval('dynami_interval_job');
        // this.schedulerRegistry.deleteTimeout('dynami_timeout_job');
    }

    addCronJob(name: string, cron: string) {
        const job = new CronJob(cron, () => {
            console.log('动态cron 123');
        });
        this.schedulerRegistry.addCronJob(name, job);
        job.start();
    }

    addInterval(name: string, milliseconds: number) {
        const interval = setInterval(() => {
            console.log('动态interval');
        }, milliseconds);
        this.schedulerRegistry.addInterval(name, interval);
    }

    addTimeout(name: string, milliseconds: number) {
        const timeout = setTimeout(() => {
            console.log('动态timeout');
        }, milliseconds);
        this.schedulerRegistry.addTimeout(name, timeout);
    }
}
