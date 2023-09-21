
export function getFilename(originalname: string) {
	let list = originalname.split('.')
	let ext = list.length > 1 ? '.' + list.at(-1) : ''
        // 在此处自定义保存后的文件名称
	let filename = `${new Date().getTime()}${ext}`;
	return filename;
}