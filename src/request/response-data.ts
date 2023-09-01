import { PageDto } from "./page.dto"

export interface PageItem {
    totalPages?: number
    itemCount?: number
    currentPage?: number
    itemsPerPage?: number
    totalItems?: number
}

export interface ReponsePage<T> extends PageItem {
    items: T[]
}

export class ResponseData<T> {
    code: number; //状态码
    msg: string; //消息
    data?: T; //数据内容

    constructor(code = 200, msg: string, data: T = null) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    static ok<T>(data: T = null, message = 'ok', code = 200): ResponseData<T> {
        return new ResponseData(code, message, data);
    }

    //给这个状态码可以让客户端给提示
    static fail(message = 'fail', code = -1): ResponseData<null> {
        return new ResponseData(code, message);
    }

    //留个刷新token的，这个一般不用来显示，会被忽略掉
    static refresh<T>(data: T = null, code = 0, message = '') {
        return new ResponseData(code, message, data);
    }

    static pageOk<T>(data: [T[], number] = [[], 0], page: PageDto, message = 'ok'): ResponseData<ReponsePage<T>> {
        let items = data[0]
        let totolCount = data[1]
        return new ResponseData(200, message, {
            items: items, //数据
            totalItems: totolCount,
            currentPage: page.page_num,
            itemsPerPage: page.page_size,
            itemCount: items.length,
            totalPages: Math.ceil(totolCount / page.page_size),
        });
    }
}