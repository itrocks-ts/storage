import { Type }       from '@itrocks/class-type'
import { Identifier } from './entity'

export type ProjectedObject<T extends object = object> = Partial<T> & { id: Identifier }

export type ProjectionCell =
	| { kind: 'value'; value: unknown; loadedFields?: readonly string[] }
	| { kind: 'absent'; at: string }
	| { kind: 'unloaded'; reason: 'ignored' }

export type ProjectionColumn = {
	path: string
	kind: 'scalar' | 'object'
	objectType?: Type
	objectFields?: readonly string[]
}

export type ProjectionResult<T extends object = object> = {
	rootType: Type<T>
	columns: readonly ProjectionColumn[]
	rows: readonly ProjectionRow[]
}

export type ProjectionRow = {
	rootId: Identifier
	cells: readonly ProjectionCell[]
}

export type Selection = SelectionPath | {
	path: SelectionPath
	objectFields?: readonly SelectionPath[]
}

export type SelectionPath = string | readonly string[]
