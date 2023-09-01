import { PageDto } from './../../request/page.dto';
import { Article } from 'src/article/entities/article.entity';
import { Feature } from 'src/feature/entities/feature.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserUpdateDto } from '../dto/req-user.dto';
import { ResponseData } from 'src/request/response-data';
import { BlackList } from '../entities/blacklist.entity';

@Injectable()
export class UserService {
    blackSet = new Set<number>()

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(BlackList)
        private blackRepository: Repository<BlackList>,
        @InjectRepository(Feature)
        private featureRepository: Repository<Feature>,
        @InjectRepository(Article)
        private articleRepository: Repository<Article>,
    ) {
        this.initBlackList()
    }

    queryUserById(id: number) {
        return this.userRepository.findOneBy({ id })
    }

    async findUser(id: number) {
        //nest的查询语句，这句意思和 findOne 一样，根据表当中的某个字段获取一个
        let user = await this.userRepository.findOneBy({ id })
        //可以通过find系列获取多个，那时需要代码和数量了
        if (!user) {
            // throw new HttpException('没找到用户', 204)
            return ResponseData.fail('该用户不存在')
        }
        return ResponseData.ok(user);
    }

    //更新用户信息
    async updateUser(
        userInfo: UserUpdateDto,
        user: User,
    ) {
        user = await this.userRepository.findOneBy({
            id: user.id
        })
        if (!user) {
            // 可以抛出一个异常告诉没找到，一般直接返回
            // throw new HttpException('该用户不存在', 204)
            return ResponseData.fail('该用户不存在')
        }
        // //update只更新，不返回那条新user，需要user需要自己拼接
        // 需要注意的是如果一些参数不存在，仍然可以更新和保存，但多出来的字段会失败，然而我们会拼接上
        //如果想避免可以手动拼接
        // await this.userRepository.update({
        //     id: userId,
        // }, userInfo)
        // return ResponseData.ok({
        //     ...user,
        //     ...userInfo,
        // })

        // //也可以直接save
        // return ResponseData.ok(
        //     await this.userRepository.save({
        //         ...user,
        //         ...userInfo
        //     })
        // )

        // 手动赋值，最累，但是存在问题最少
        if (userInfo.age) user.age = userInfo.age;
        if (userInfo.mobile) user.mobile = userInfo.mobile;
        if (userInfo.nickname) user.nickname = userInfo.nickname;
        if (userInfo.sex) user.sex = userInfo.sex;
        await this.userRepository.save(user)
        return ResponseData.ok(user)
    }

    //我的收藏
    async getCollects(
        user: User,
    ) {
        user = await this.userRepository.findOne({
            relations: {
                collects: true
            },
            where: {
                id: user.id,
            },
        })
        if (!user) {
            return ResponseData.fail('该用户不存在')
        }
        return ResponseData.ok(user.collects)
    }

    //我的文章
    async getArticles(
        body: PageDto,
        user: User,
    ) {
        let page = new PageDto(body) //创建pagedto对象
        //文章比较多，这里可以做一个分页)，顺道获取一下总数量
        //findAndCount结果是[articles[], count]，find的结果是articles[]
        let articles = await this.articleRepository.findAndCount({
            where: {
                userId: user.id,
                isDelete: false,
            },
            order: {
                createTime: 'DESC', //我们按照时间降序排列
            },
            skip: page.skip, //自己计算页码和数量
            take: page.take,
        })
        return ResponseData.pageOk(articles, page)
    }

    //我的专栏
    async getFeatures(
        body: PageDto,
        user: User,
    ) {
        let page = new PageDto(body) //创建pagedto对象
        //直接获取即可，也可以通过user直接获取，只不多多查询了用户表
        let features = await this.featureRepository.findAndCount({
            where: {
                userId: user.id
            },
            skip: page.skip, //自己计算页码和数量
            take: page.take,
        })
        return ResponseData.pageOk(features, page)
    }

    //我订阅的专栏
    async getSubscribeFeature(
        user: User,
    ) {
        //多对多，这样获取最方便，但不是最快的，因为多了一个查找用户表的过程
        user = await this.userRepository.findOne({
            where: {
                id: user.id,
            },
            relations: {
                subscribeFeatures: true
            }
        })
        if (!user) {
            return ResponseData.fail('该用户不存在')
        }
        return ResponseData.ok(user.subscribeFeatures)
    }

    //注销用户
    async unregister(
        user: User,
    ) {
        let black = await this.blackRepository.findOneBy({
            userId: user.id
        })
        console.log(user)
        if (!black) {
            this.blackSet.add(user.id)
            black = new BlackList()
            black.userId = user.id
            await this.blackRepository.save(black)   
        }
        return ResponseData.ok('注销成功');
    }

    //恢复用户
    async recoverUser(
        user: User,
    ) {
        let black = await this.blackRepository.findOneBy({
            userId: user.id
        })
        if (black) {
            await this.blackRepository.delete({
                userId: user.id
            })
            this.blackSet.delete(user.id)
        }
        return ResponseData.ok('恢复成功');
    }

    async initBlackList() {
        //初始化黑名单
        let blackList = await this.blackRepository.find()
        let set = this.blackSet
        blackList.forEach(function(e) {
            set.add(e.userId)
        })
    }

    async deleteBlackList(
        userId: number,
    ) {
        this.blackSet.delete(userId)
        await this.blackRepository.delete({ userId })
    }
}
