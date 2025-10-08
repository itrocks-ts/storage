
import { Option }  from './option'
import { Reverse } from '@itrocks/sort'

type PropertyPath  = string | Reverse
type PropertyPaths = Array<PropertyPath>

export class Sort extends Option
{

	properties: PropertyPaths

	constructor(properties: PropertyPaths)
	{
		super()
		this.properties = properties.map(property =>
			((typeof property === 'string') && '!-'.includes(property[0]))
				? new Reverse(property.slice(1))
				: property
		)
	}

}
