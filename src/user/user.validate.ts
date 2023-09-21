import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

//模仿一个
@ValidatorConstraint()
export class IsMoney implements ValidatorConstraintInterface {
	//第一个参数是接收到的我们的参数，第二个是validate的三个参数中第二个传递的(为数组类型)
	validate(text: string, validationArguments: ValidationArguments) {
		return typeof text === 'string' && /(^\d{1}$|^[1-9]\d+$)|(^[1-9]\d*|^0)\.\d{1,2}$/.test(text)
	}

	defaultMessage(args: ValidationArguments) {
		//也可以使用带属性命的来提示默认效果
		return `${args.property}不是金额类型字符串`;
	}
}