import { PageDto } from './../request/page.dto';
import { Feature } from 'src/feature/entities/feature.entity';
import { Article } from 'src/article/entities/article.entity';
import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    HttpException,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Request,
    Res,
    Response,
    Session,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { LoginDto, UserDto, UserUpdateDto } from './dto/req-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { APIResponse } from 'src/request/response';
import { Guards, Public, PublicUser, ReqUser } from './user.decorator';
import { AuthService } from './service/auth.service';
import { TokenDto } from './dto/res-user.dto';
import { User } from './entities/user.entity';
import { CookieExtend } from './user.session';
import { UserGuard } from './user.guard';
import { ArticleDto } from 'src/article/dto/res-article.dto';
import { FeatureDto } from 'src/feature/dto/res-feature.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}
    // 使用query类型
    // .../api?id=value&...
    @ApiOperation({
        summary: '获取用户信息',
    })
    @PublicUser()
    @APIResponse(UserDto)
    @Get('detail') //命名追加到url路径上
    getUserInfo(@Query('id') id: number, @ReqUser() user: User) {
        return this.userService.findUser(id ? id : user.id);
    }

    @ApiOperation({
        summary: '修改用户信息',
    })
    @APIResponse(UserDto)
    @Post('update_user')
    updateUserInfo(
        //可以获取headers中的内容，例如版本号平台
        @Body() userInfo: UserUpdateDto,
        @ReqUser() user: User,
        // @Headers() headers: any, //获取headers
        // @Request() req: Request, //获取请求
    ) {
        return this.userService.updateUser(userInfo, user);
    }

    @ApiOperation({
        summary: '注册',
    })
    @Public()
    @APIResponse(UserDto)
    @Post('register')
    register(@Body() loginInfo: LoginDto) {
        return this.authService.register(loginInfo);
    }

    @ApiOperation({
        summary: '登陆',
    })
    @Public() // @UseGuards(UserGuard) @Guards()
    @APIResponse(TokenDto)
    @Post('login')
    login(@Body() loginInfo: LoginDto) {
        return this.authService.login(loginInfo);
    }

    @ApiOperation({
        summary: '刷新',
    }) // @UseGuards(UserGuard) @Guards()
    @APIResponse(TokenDto)
    @Post('refresh_token')
    refreshToken(@ReqUser() user: User) {
        return this.authService.refreshToken(user);
    }

    @ApiOperation({
        summary: '注销/退出登录',
    })
    @Post('logout')
    logout(
        @ReqUser() user: User, //使用我们之前校验顺道加入的 user
    ) {
        return this.authService.logout();
    }

    @ApiOperation({
        summary: 'web端登录',
    })
    @Public()
    @APIResponse()
    @Post('login_web')
    loginWeb(@Body() loginInfo: LoginDto, @Session() session: CookieExtend) {
        return this.authService.loginWithCookie(loginInfo, session);
    }

    @ApiOperation({
        summary: '注销用户',
    })
    @APIResponse()
    @Post('unregister_user')
    unregister(@ReqUser() user: User) {
        return this.userService.unregister(user);
    }

    @ApiOperation({
        summary: '恢复用户',
    })
    @Public()
    @APIResponse()
    @Post('recover_user')
    recoverUser(@Body() loginInfo: LoginDto) {
        return this.authService.recoverUser(loginInfo);
    }

    @ApiOperation({
        summary: '删除用户(真删请勿调用)',
    })
    @Public()
    @APIResponse()
    @Post('force_delete_user')
    deleteUser(@Body() loginInfo: LoginDto) {
        return this.authService.deleteUser(loginInfo);
    }

    @ApiOperation({
        summary: '我收藏的文章',
    })
    @APIResponse([Article])
    @Post('collects')
    collects(@ReqUser() user: User) {
        return this.userService.getCollects(user);
    }

    @ApiOperation({
        summary: '我发布的文章',
    })
    @APIResponse([Article], true)
    @Post('articles')
    articles(@Body() body: PageDto, @ReqUser() user: User) {
        return this.userService.getArticles(body, user);
    }

    @ApiOperation({
        summary: '我的专栏',
    })
    @APIResponse([Feature], true)
    @Post('features')
    features(@Body() body: PageDto, @ReqUser() user: User) {
        return this.userService.getFeatures(body, user);
    }

    @ApiOperation({
        summary: '我的订阅的专栏',
    })
    @APIResponse([Feature])
    @Post('subscribe_feature')
    subscribeFeature(@ReqUser() user: User) {
        return this.userService.getSubscribeFeature(user);
    }

    @ApiOperation({
        summary: '收藏数量排行榜(redis)',
    })
    @Public()
    @APIResponse([ArticleDto], true)
    @Get('ranking')
    ranking(@Query() params: PageDto) {
        return this.userService.ranking(params);
    }
    
    @ApiOperation({
        summary: '测试事务',
    })
    @Public()
    @Post('test_transaction')
    testTransaction() {
        return this.userService.transactionOthers();
    }
}
