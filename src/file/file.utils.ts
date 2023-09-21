import { fstatSync, open, read } from 'fs';
import { join } from 'path';

interface ChunkFileInfo {
	offset: number //偏移量
	size: number //总大小
	chunkSize: number //设置块大小 
	readSize: number, //实际读取大小
	buffer: Buffer
	isCompleted: boolean, //文件读取完毕
}

//chunkSize 64MB
//路径、文件大小、偏移量，块大小
export function readChunkFile(path: string, size: number, offset = 0, chunkSize = 64 * 1024 * 1024): Promise<ChunkFileInfo> {
	return new Promise((resolve, reject) => {
		let buffer1 = Buffer.alloc(chunkSize); //buffer的长度，然后读取指定长度buffer
		// let fullPath = join(__dirname, `../../${path}`)
		let fullPath = join(process.cwd(), path) //这两个都行
		open(fullPath, function(err: any, fd: number) {
			if (err) {
				reject('打开文件失败')
				return
			}
			read(fd, buffer1, 0, chunkSize, offset, function(err: NodeJS.ErrnoException, bytesRead: number, buffer: Buffer) {
				if (err) {
					reject('获取文件失败')
				}
				console.log(bytesRead, buffer)
				resolve({
					offset, //偏移量
					size, //总大小
					chunkSize, //设置块大小 
					readSize: bytesRead, //实际读取大小
					buffer,
					isCompleted: bytesRead < chunkSize || offset + chunkSize >= size, //文件读取完毕(可能size传递不对，多判断一下即可)
				})
			})
		})	
	})
}



export interface ChunkInfo {
	offset: number
	totolSize: number //总大小
	size: number
	buffer: Buffer
	isCompleted: boolean, //文件读取完毕
}

//需要传递 path 和 文件大小size，块的大小不传递默认 64m，分割太小影响整体传输速度，分割太大较为占用内存，选一个默认的居中的分块大小
export function uploadByFileHandle(path: string, chunkCallback: (err: Error | null, info: ChunkInfo | null) => Promise<boolean>, offset?: number, chunkSize?: number) {
	// let fullPath = join(__dirname, `../../${path}`)
	let fullPath = join(process.cwd(), path) //这两个都行
	open(fullPath, async function (err: NodeJS.ErrnoException, fd: number) {
		if (err) {
			chunkCallback(err, null)
			return
		}
		const file = fstatSync(fd)
		const size = file.size
		chunkSize = chunkSize ? chunkSize : 64 * 1024 * 1024 //64MB
		function readFile(offset: number) {
			const readSize = offset + chunkSize > size ? size - offset : chunkSize
			const buffer = Buffer.alloc(readSize); //buffer的长度，然后读取指定长度buffer
			read(fd, buffer, 0, readSize, offset, async function (err: NodeJS.ErrnoException, bytesRead: number, buffer: Buffer) {
				if (err) {
					chunkCallback(err, null)
					return
				}
				const nextoffset = offset + chunkSize
				let isCompleted = nextoffset >= size //文件读取完毕(可能size传递不对，多判断一下即可)
				let result = await chunkCallback(null, {
					offset,
					totolSize: size,
					size: bytesRead,
					buffer,
					isCompleted,
				})
				if (!result) return
				buffer = null
				//结束了就不继续读取了
				if (!isCompleted) {
					readFile(nextoffset)
				}
			})
		}
		readFile(offset ? offset : 0)
	})
}
