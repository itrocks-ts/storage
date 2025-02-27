import { DataSource, SearchType }        from './data-source'
import { Entity, Identifier, MayEntity } from './entity'

export { DataSource, Entity, Identifier, MayEntity, SearchType }

let dataSources: Record<string, DataSource> = {}

export function createDataSource(config: { engine: string, [key: string]: any }, dataSource = 'main')
{
	const { engine, ...engineConfig } = config
	return dataSources[dataSource]    = new (require(engine).default)(engineConfig)
}

export { dataSource, dataSource as ds }
export default function dataSource(dataSource = 'main')
{
	return dataSources[dataSource] ?? (() => { throw 'Unknown data source ' + dataSource })()
}
