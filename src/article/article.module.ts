import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Feature } from 'src/feature/entities/feature.entity';
import { FeatureService } from 'src/feature/feature.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([Feature]),
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    FeatureService,
  ]
})
export class ArticleModule {}
