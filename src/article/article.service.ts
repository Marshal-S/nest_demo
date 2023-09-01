import { ArticleDetalDto } from './dto/res-article.dto';
import { Injectable } from '@nestjs/common';
import { ArticleCollectDto, ArticleCreateDto, ArticleIdDto, ArticleQueryDto, ArticleUpdateDto } from './dto/req-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Equal, ILike, In, Like, Repository, getConnection, getManager } from 'typeorm';
import { ResponseData } from 'src/request/response-data';
import { User } from 'src/user/entities/user.entity';
import { Feature } from 'src/feature/entities/feature.entity';
import { PageDto } from 'src/request/page.dto';
import { ArticleStatus } from './article.enum';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
  ) { }

  //创建、加入专栏
  async create(
    body: ArticleCreateDto,
    user: User,
  ) {
    let article = new Article();
    article.title = body.title;
    article.desc = body.desc;
    article.content = body.content;

    if (body.feature_id) {
      let feature = await this.featureRepository.findOneBy({
        id: body.feature_id
      });
      if (!feature) {
        return ResponseData.fail('该专栏不存在');
      }
      article.feature = feature;
    }

    article.user = user; //设置外键关联，属于某一个用户
    await this.articleRepository.save(article);
    return ResponseData.ok(article);
  }

  //更新
  async update(
    body: ArticleUpdateDto,
    user: User,
  ) {
    let article = await this.articleRepository.findOne({
      where: {
        id: body.id,
        isDelete: false,
      },
      relations: {
        user: true
      },
    });
    if (!article) {
      return ResponseData.fail('该文章不存在');
    }
    if (body.title) article.title = body.title;
    //下面两个允许清空就不判断了
    if (body.status != undefined) body.status = body.status;
    article.desc = body.desc;
    article.content = body.content
    await this.articleRepository.save(article)
    return ResponseData.ok(article);
  }

  //软删除
  async remove(
    body: ArticleIdDto,
    user: User,
  ) {
    let article = await this.articleRepository.findOneBy({
      id: body.id,
      isDelete: false,
    });
    if (!article) {
      return ResponseData.fail('该文章不存在');
    }
    if (article.userId !== user.id) {
      return ResponseData.fail('无权限操作');
    }
    article.isDelete = true
    await this.articleRepository.save(article)
    return ResponseData.ok();
  }

  //删除
  async delete(
    body: ArticleIdDto,
    user: User,
  ) {
    let article = await this.articleRepository.findOneBy({
      id: body.id,
    });
    if (!article) {
      return ResponseData.fail('该文章不存在');
    }
    if (article.userId !== user.id) {
      return ResponseData.fail('无权限操作');
    }
    await this.articleRepository.delete({
      id: body.id
    })
    return ResponseData.ok();
  }

  //查看文章
  async getArticle(
    body: ArticleIdDto,
    user: User,
  ) {
    let article = user ? (
      await this.articleRepository.findOne({
        where: {
          id: body.id,
          isDelete: false,
          collects: {
            id: user.id
          }
        },
        relations: {
          collects: true,
          user: true,
        },
      })
    ) : (
      await this.articleRepository.findOneBy({
        id: body.id
      })
    )
    if (!article) {
      return ResponseData.fail('该文章不存在');
    }
    //查看是否收藏(这样做是否感觉性能稍低？)
    let isCollect = false
    if (user && article.collects?.length > 0) {
      isCollect = true
    }
    article.collects = undefined;
    //可以查一下文章是否被收藏
    return ResponseData.ok({
      ...article,
      isCollect
    });
  }

  //查看文章改进版本，使用queryBuilder
  async getArticleEx(
    body: ArticleIdDto,
    user: User,
  ) {
    // 左连接leftJoin跟我们的默认查询一样，关联查询到就将数据合并到指定位置
    // 内连接 innerJoin 取交集，无论是主体还是关联，有一个查询不到，就为空
    //这个跟上面的关系查询的一眼
    // let article = await this.articleRepository
    //   .createQueryBuilder('article')
    //   leftJoinAndSelect('article.user', 'user')
    //   //连接对象映射，第一个为映射到赋值的属性名，第二个为其重命名，
    //   .leftJoinAndSelect('article.collects', 'collect') 
    //   .where('article.id=:id AND article.isDelete=:isDelete', {
    //     id: body.id,
    //     isDelete: false,
    //   })
    //   .getOne()
    // 里面也有 skip、take、getManyAndCount，相信知道怎么用了

    //这是我们的简化版本，直接查找到收藏者为我们的
    let article = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('article.collects', 'collect')
      // .innerJoinAndSelect('article.collects', 'user')//这个一旦找不到主体也不返回，不适合
      .where('article.id=:id AND article.isDelete=:isDelete', {
        id: body.id,
        isDelete: false,
      })
      .andWhere('collect.id=:userId', {
        userId: user.id
      })
      .getOne()
    if (!article) {
      return ResponseData.fail('该文章不存在');
    }
    let isCollect = false
    if (article.collects.length > 0) {
      isCollect = true;
    }
    article.collects = undefined;
    return ResponseData.ok({
      ...article,
      isCollect,
    })
  }

  //收藏文章
  async collect(
    body: ArticleCollectDto,
    user: User,
  ) {
    let article = await this.articleRepository.findOne({
      where: {
        id: body.id,
        isDelete: false,
      },
      relations: {
        collects: true,
      }
    })
    if (!article) {
      return ResponseData.fail('该文章不存在');
    }
    //查询收藏者
    let userId = user.id
    let index = article.collects.findIndex(e => e.id == userId)
    let isCollect = index >= 0

    if (body.is_collect == 1 && !isCollect) {
      //尚未收藏、进行收藏
      article.collects.push(user);
      // article.collects.push({id: user.id} as User);//如果用的不是user，是userid的话，转化一下，关系实际只也用到了主键id
    } else if (body.is_collect != 1 && isCollect) {
      //已收藏、取消收藏
      article.collects.splice(index, 1)
    }
    await this.articleRepository.save(article)
    return ResponseData.ok();
  }

  async collectEx(
    body: ArticleCollectDto,
    user: User,
  ) {
    let article = await this.articleRepository.findOne({
      where: {
        id: body.id,
        isDelete: false,
      }
    })
    if (!article) {
      return ResponseData.fail('该文章不存在');
    }
    let builder = this.articleRepository
      .createQueryBuilder()
      .relation(Article, 'collects')
      .of(article) //我们的文章实体和user多对多，我们给collects添加新的user关联
      // 多对多，一对多的情况使用 add、remove
      // .add(user) //添加关联
      // .remove(user) //移除关联
      // 一对一、多对一的情况使用 set
      // .set(user) //只有一个，即添加、更新关联
      // .set(null) //删除该关联
      // .loadOne(); //需要加载的话，可以直接加载一个到多个关联对象
    if (body.is_collect == 1) {
      try {
        //直接收藏，添加已存在的会报错，errno: 1062
        await builder.add(user)
      } catch(err) {
        if (err.errno === 1062) {
          //重复，也就是已经收藏
          return ResponseData.ok()
        }else {
          return ResponseData.fail(err.msg, 500)
        }
      }
    }else {
      //删除不存在的不会报错
      await builder.remove(user)
    }
    return ResponseData.ok();
  }

  async query(
    body: ArticleQueryDto,
    user: User
  ) {
    if (!body.id && !body.name && !body.status &&!body.nickname) {
      return ResponseData.fail('缺少参数');
    }
    let page = new PageDto(body)
    // let articles = await this.articleRepository.findAndCount({
    //   //中括号是或的关系
    //   where: [
    //     {
    //       //大括号内，同级是且，单个或使用In，也可使用其他查询
    //       //判断是否相符，如果不存在，就会自动忽略该条件了，由于模糊查询非常优秀
    //       //如果非要插 null 的，那么需要使用 Equal() 包装了
    //       id: body.id,
    //       title: body.name && Like(`%${body.name}%`), //Ilike忽略大小写,like不忽略大小写
    //       status: body.status && In(body.status), //这里面是或的关系
    //     },
    //     {
    //       id: body.id,
    //       desc: body.name && Like(`%${body.name}%`), //Ilike忽略大小写,like不忽略大小写
    //       status: body.status && In(body.status), //这里面是或的关系
    //     },
    //     {
    //       id: body.id,
    //       content: body.name && Like(`%${body.name}%`), //Ilike忽略大小写,like不忽略大小写
    //       status: body.status && In(body.status), //这里面是或的关系
    //     },
    //     { //查询用户和其他选项是或的关系
    //       user: {
    //         nickname: ILike(`%${body.nickname}%`), //忽略大小写，模糊查询
    //       }
    //     }
    //   ],
    //   relations: {
    //     user: true
    //   },
    //   skip: page.skip,
    //   take: page.take,
    // })
    let articles = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .where('article.id=:id AND article.status=:status', {
        id: body.id,
        status: body.status,
      })
      .andWhere('article.title=:name OR article.desc=:name OR article.content=:name', {
        name: body.name
      })
      .orWhere('user.nickname LIKE :nickname', {
        nickname: `%${body.nickname}%`,
      })
      .skip(page.skip)
      .take(page.take)
      .getManyAndCount()
    return ResponseData.pageOk(articles, page);
  }
}
