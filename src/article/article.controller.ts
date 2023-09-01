import { Public, PublicUser } from './../user/user.decorator';
import { ArticleDetalDto, ArticleDto } from './dto/res-article.dto';
import { APIResponse } from 'src/request/response';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { ArticleCollectDto, ArticleCreateDto, ArticleIdDto, ArticleQueryDto, ArticleUpdateDto } from './dto/req-article.dto';
import { ReqUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('article')
@Controller('article')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) { }
	//设置的均为用户操作，管理员强制操作可以另加接口
	@ApiOperation({
		summary: '创建文章'
	})
	@APIResponse(ArticleDto)
	@Post('create')
	create(
		@Body() body: ArticleCreateDto,
		@ReqUser() user: User,
	) {
		return this.articleService.create(body, user);
	}

	@ApiOperation({
		summary: '修改文章'
	})
	@APIResponse(ArticleDto)
	@Post('update')
	update(
		@Body() body: ArticleUpdateDto,
		@ReqUser() user: User,
	) {
		return this.articleService.update(body, user);
	}

	@ApiOperation({
		summary: '软删除文章'
	})
	@APIResponse()
	@Post("remove")
	remove(
		@Body() body: ArticleIdDto,
		@ReqUser() user: User,
	) {
		return this.articleService.remove(body, user);
	}

	@ApiOperation({
		summary: '删除文章'
	})
	@APIResponse()
	@Post("delete")
	delete(
		@Body() body: ArticleIdDto,
		@ReqUser() user: User,
	) {
		return this.articleService.delete(body, user);
	}

	@ApiOperation({
		summary: '查看文章'
	})
	@PublicUser() //油user带user
	@APIResponse(ArticleDetalDto)
	@Post("detail")
	getArticle(
		@Body() body: ArticleIdDto,
		@ReqUser() user: User,
	) {
		return this.articleService.getArticle(body, user);
	}

	@ApiOperation({
		summary: '查看文章Ex'
	})
	@PublicUser() //油user带user
	@APIResponse(ArticleDetalDto)
	@Post("detail_ex")
	getArticleEx(
		@Body() body: ArticleIdDto,
		@ReqUser() user: User,
	) {
		return this.articleService.getArticleEx(body, user);
	}

	@ApiOperation({
		summary: '收藏文章'
	})
	@APIResponse()
	@Post("collect")
	collect(
		@Body() body: ArticleCollectDto,
		@ReqUser() user: User,
	) {
		return this.articleService.collect(body, user)
	}

	@ApiOperation({
		summary: '收藏文章ex'
	})
	@APIResponse()
	@Post("collect_ex")
	collectEx(
		@Body() body: ArticleCollectDto,
		@ReqUser() user: User,
	) {
		return this.articleService.collectEx(body, user)
	}

	@ApiOperation({
		summary: '查询文章'
	})
	@Public()
	@APIResponse([ArticleDto], true)
	@Post("query")
	query(
		@Body() body: ArticleQueryDto,
		@ReqUser() user: User,
	) {
		return this.articleService.query(body, user)
	}
}
