import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from './entities/feature.entity';
import { Article } from 'src/article/entities/article.entity';
import { ArticleService } from 'src/article/article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feature]),
    TypeOrmModule.forFeature([Article]),
  ],
  controllers: [FeatureController],
  providers: [
    FeatureService,
    ArticleService,
  ]
})
export class FeatureModule {}
