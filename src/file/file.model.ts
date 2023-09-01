
export function getFilename(originalname: string) {
	let ext = originalname.split('.').at(-1);
        // 在此处自定义保存后的文件名称
	let filename = `${new Date().getTime()}.${ext ? ext : ''}`;
	return filename;
}