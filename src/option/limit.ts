import { Option } from './option'

export class Limit extends Option
{

	constructor(public limit: number, public offset = 0)
	{
		super()
	}

}

export function limit(limit: number, offset = 0)
{
	return new Limit(limit, offset)
}
