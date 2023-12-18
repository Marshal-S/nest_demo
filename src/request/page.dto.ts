import { ApiPropertyOptional } from '@nestjs/swagger';

export const defaultPageNum = 1; //默认第一页码
export const defaultPageSize = 10; //每页默认数量

export class PageDto {
    @ApiPropertyOptional({ description: '页码 1 开始', example: 1 })
    page_num: number

    @ApiPropertyOptional({ description: '每页数量', example: 10 })
    page_size: number

    get skip() {
        return (this.page_num - 1) * this.page_size;
    }

    get take() {
        return this.page_size;
    }

    constructor(page: PageDto) {
        this.page_num =
            (page?.page_num && parseInt(page.page_num + '')) || defaultPageNum;
        this.page_size =
            (page?.page_size && parseInt(page.page_size + '')) ||
            defaultPageSize;
    }
}
