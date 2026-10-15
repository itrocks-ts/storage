import { isAnyType }  from '@itrocks/class-type'
import { DataSource } from './data-source'

export { DataSource, Options, SearchType }             from './data-source'
export { Entity, Identifier, isIdentifier, MayEntity } from './entity'

export { Identifiers }                      from './option/identifiers'
export { Limit }                            from './option/limit'
export { Option }                           from './option/option'
export { PropertyPath, PropertyPaths, Sort } from './option/sort'

export { ProjectedObject, ProjectionCell, ProjectionColumn, ProjectionResult, ProjectionRow } from './projection'
export { Selection, SelectionPath }                                                         from './projection'
export { SelectionError, SelectionErrorCode }                                               from './selection-error'

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
