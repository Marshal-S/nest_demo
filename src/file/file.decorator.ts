import { ApiBody, ApiConsumes } from "@nestjs/swagger"

//我们包装一下，至少用着方便了
export const ApiFileConsumes = () => ApiConsumes('multipart/form-data')
export const ApiFileBody = () => ApiBody({
	schema: {
		type: 'object',
		properties: {
			file: {
				type: 'string',
				format: 'binary',
			},
		},
	},
})