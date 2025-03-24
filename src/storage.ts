import { isAnyType }                     from '@itrocks/class-type'
import { DataSource, SearchType }        from './data-source'
import { Entity, Identifier, MayEntity } from './entity'

export { DataSource, Entity, Identifier, MayEntity, SearchType }

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
