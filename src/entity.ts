
export type Entity<T extends object = object> = T & { id: Identifier }
export type MayEntity<T extends object = object> = T | Entity<T>

export type Identifier = BigInt | Number | String

export function isIdentifier(object: any) : object is Identifier
{
	return typeof object === 'bigint'
		|| typeof object === 'number'
		|| typeof object === 'string'
}
