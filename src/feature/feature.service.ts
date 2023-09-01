import { Injectable } from '@nestjs/common';
import { FeatureCreateDto, FeatureUpdateDto, FeatureIdDto, FeatureJoinDto } from './dto/req-feature.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Feature } from './entities/feature.entity';
import { Repository } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { ResponseData } from 'src/request/response-data';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(
    body: FeatureCreateDto,
    user: User,
  ) {
    let feature = new Feature();
    feature.name = body.name;
    feature.user = user
    await this.featureRepository.save(feature)
    return ResponseData.ok(feature)
  }

  async update(
    body: FeatureUpdateDto,
    user: User,
  ) {
    let feature = await this.featureRepository.findOne({
      where: {
        id: body.id
      }
    })
    if (!feature) {
      return ResponseData.fail('该专栏不存在');
    }
    if (feature.userId !== user.id) {
      return ResponseData.fail('无权限操作');
    }
    if (feature.name) feature.name = body.name;
    if (feature.status) feature.status = body.status;
    await this.featureRepository.save(feature);
    return ResponseData.ok(feature);
  }

  async getDetail(
    body: FeatureIdDto,
    user: User,
  ) {
    let feature = await this.featureRepository.findOne({
      where: {
        id: body.id
      },
      relations: {
        user: true,
        articles: true,
        subscribes: true,
      }
    });
    if (!feature) {
      return ResponseData.fail('该专栏不存在');
    }
    return ResponseData.ok(feature);
  }

  async delete(
    body: FeatureIdDto,
    user: User,
  ) {
    let feature = await this.featureRepository.findOne({
      where: {
        id: body.id
      }
    })
    if (!feature) {
      return ResponseData.fail('该专栏不存在');
    }
    if (feature.userId !== user.id) {
      return ResponseData.fail('无权限操作');
    }
    //找到一个专栏就不能删除
    //为何不用上面直接关系查询呢，因为上面的关系实际也是到这个表中对比找出所有该专栏的
    //因为找出多个实际效率还会低，因此这里面直接寻找的，也是提高效率的一种手段
    let article = await this.articleRepository.findOne({
      where: {
        featureId: body.id
      }
    })
    if (article) {
      return ResponseData.fail('专栏内有文章，无法删除');
    }
    await this.featureRepository.delete({
      id: body.id
    })
    return ResponseData.ok();
  }

  //往专栏加入文章
  async joinArticle(
    body: FeatureJoinDto,
    user: User,
  ) {
    let feature = await this.featureRepository.findOneBy({
      id: body.id
    })
    if (!feature) {
      return ResponseData.fail('该专栏不存在');
    }
    if (feature.userId !== user.id) {
      return ResponseData.fail('无权限操作');
    }
    let article = await this.articleRepository.findOneBy({
      id: body.article_id
    })
    if (!article) {
      return ResponseData.fail('该文章不存在');
    }
    article.feature = feature;
    await this.articleRepository.save(article);
    return ResponseData.ok();
  }

  //订阅专栏
  async subscribe(
    body: FeatureIdDto,
    user: User,
  ) {
    let feature = await this.featureRepository.findOne({
      where: {
        id: body.id,
      },
      relations: {
        subscribes: true
      }
    })
    if (!feature) {
      return ResponseData.fail('该专栏不存在');
    }
    let userId = user.id
    let index = feature.subscribes.findIndex(e => e.id == userId)
    if (index >= 0) {
      //已经订阅
      feature.subscribes.splice(index, 1)
    }else {
      //未订阅
      feature.subscribes.push(user)
    }
    await this.featureRepository.save(user)
    return ResponseData.ok();
  }
}
