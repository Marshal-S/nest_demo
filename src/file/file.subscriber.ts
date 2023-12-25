import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm'
import { File } from './entities/file.entity'
import { MinioService } from './minio.service'

@EventSubscriber()
export class FileSubscriber implements EntitySubscriberInterface<File> {
    constructor(dataSource: DataSource, private minioService: MinioService) {
        dataSource.subscribers.push(this)
    }

    listenTo() {
        return File
    }

    async afterLoad(entity: File) {
        if (!entity.filename) {
            return
        }
        entity.url = await this.minioService.getPresignedUrl(entity.filename)
    }
}
