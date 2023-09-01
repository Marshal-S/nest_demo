//文章状态
export enum ArticleStatus {
	editing = 0, //编辑中，创建完毕后，默认编辑
	waiting, //发布后，等待审核中
	checking, //审核中
	success, //成功
	failure, //失败
}