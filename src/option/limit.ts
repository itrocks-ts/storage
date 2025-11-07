import { Option } from './option'

export class Limit extends Option
{

	constructor(public limit: number, public offset = 0)
	{
		super()
	}

}
