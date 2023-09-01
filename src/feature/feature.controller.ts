import { APIResponse } from 'src/request/response';
import { Feature } from 'src/feature/entities/feature.entity';
import { Body, Controller, Post } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeatureCreateDto, FeatureIdDto, FeatureJoinDto, FeatureUpdateDto } from './dto/req-feature.dto';
import { ReqUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { FeatureDetailDto, FeatureDto } from './dto/res-feature.dto';

@ApiTags('feature')
@Controller('feature')
export class FeatureController {
	constructor(private readonly featureService: FeatureService) { }
	//设置的均为用户操作，管理员可以另加接口
	@ApiOperation({
		summary: '创建专栏'
	})
	@APIResponse(FeatureDto)
	@Post('create')
	create(
		@Body() body: FeatureCreateDto,
		@ReqUser() user: User,
	) {
		return this.featureService.create(body, user);
	}

	@ApiOperation({
		summary: '更新专栏'
	})
	@APIResponse(FeatureDto)
	@Post('update')
	update(
		@Body() body: FeatureUpdateDto,
		@ReqUser() user: User,
	) {
		return this.featureService.update(body, user);
	}

	@ApiOperation({
		summary: '专栏详情'
	})
	@APIResponse(FeatureDetailDto)
	@Post("detail")
	detail(
		@Body() body: FeatureIdDto,
		@ReqUser() user: User,
	) {
		return this.featureService.getDetail(body, user)
	}

	@ApiOperation({
		summary: '删除专栏'
	})
	@APIResponse()
	@Post("delete")
	delete(
		@Body() body: FeatureIdDto,
		@ReqUser() user: User,
	) {
		return this.featureService.delete(body, user);
	}

	@ApiOperation({
		summary: '专栏内添加文章'
	})
	@APIResponse()
	@Post("join_article")
	joinArticle(
		@Body() body: FeatureJoinDto,
		@ReqUser() user: User,
	) {
		return this.featureService.joinArticle(body, user)
	}

	@ApiOperation({
		summary: '用户订阅专栏'
	})
	@APIResponse()
	@Post("subscribe")
	subscribe(
		@Body() body: FeatureIdDto,
		@ReqUser() user: User,
	) {
		return this.featureService.subscribe(body, user)
	}
}
