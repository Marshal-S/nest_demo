//public 装饰器的状态，默认不带token(user)
export enum PublicStatus {
	default = 1, //不带user
	token = 2, //有token带toke，没有就不带
	none = 0, //不带token，和不写一样
}