import { Identifier } from '../entity'
import { Option }     from './option'

export class Identifiers extends Option
{

	constructor(readonly ids: readonly Identifier[])
	{
		super()
	}

}
