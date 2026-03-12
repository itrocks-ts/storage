import { isAnyType }  from '@itrocks/class-type'
import { DataSource } from './data-source'

export { DataSource, Options, SearchType }             from './data-source'
export { Entity, Identifier, isIdentifier, MayEntity } from './entity'

export { Limit }                             from './option/limit'
export { Option }                            from './option/option'
export { PropertyPath, PropertyPaths, Sort } from './option/sort'

let dataSources: Record<string, DataSource> = {}

export function createDataSource(config: { engine: string, [key: string]: any }, dataSource = 'main')
{
	const { engine, ...engineConfig } = config
	const module = require(engine)
	const type   = module.default ?? Object.values(module).find(any => isAnyType(any))
	return dataSources[dataSource] = new type(engineConfig)
}

export { dataSource as ds }
export function dataSource(dataSource = 'main')
{
	return dataSources[dataSource] ?? (() => { throw 'Unknown data source ' + dataSource })()
}
