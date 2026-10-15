import { Reverse }            from '@itrocks/sort'
import { DataSource }         from '@itrocks/storage'
import { Entity }             from '@itrocks/storage'
import { Identifiers }        from '@itrocks/storage'
import { Options }            from '@itrocks/storage'
import { ProjectedObject }    from '@itrocks/storage'
import { ProjectionCell }     from '@itrocks/storage'
import { ProjectionColumn }   from '@itrocks/storage'
import { ProjectionResult }   from '@itrocks/storage'
import { ProjectionRow }      from '@itrocks/storage'
import { PropertyPath }       from '@itrocks/storage'
import { SearchType }         from '@itrocks/storage'
import { Selection }          from '@itrocks/storage'
import { SelectionError }     from '@itrocks/storage'
import { SelectionErrorCode } from '@itrocks/storage'
import { SelectionPath }      from '@itrocks/storage'

class Customer
{

	name = ''
	other = ''

}

class Invoice
{

	number = ''

}

// Every legacy abstract operation is still fulfilled without declaring select.
class LegacyAdapter extends DataSource
{

	close: DataSource['close'] = async () => {}
	count: DataSource['count'] = async () => 0
	delete: DataSource['delete'] = async object => object
	deleteId: DataSource['deleteId'] = () => {}
	deleteRelatedId: DataSource['deleteRelatedId'] = () => {}
	insertRelatedId: DataSource['insertRelatedId'] = () => {}
	read: DataSource['read'] = async () => { throw new Error('Not used') }
	readCollection: DataSource['readCollection'] = async () => []
	readCollectionIds: DataSource['readCollectionIds'] = async () => []
	readMultiple: DataSource['readMultiple'] = async () => []
	save: DataSource['save'] = async () => { throw new Error('Not used') }
	search: DataSource['search'] = async () => []

}

const adapter: DataSource = new LegacyAdapter()
const path: SelectionPath = ['customer', 'name'] as const
const selections: readonly Selection[] = [path, 'number', { path: 'customer', objectFields: [['name']] }]
const options: Options = new Identifiers([1, '2', 3n] as const)
const search: SearchType<Invoice> = { number: 'INV-1' }
const promise: Promise<ProjectionResult<Invoice>> = adapter.select(Invoice, selections, search, options)
const defaults: Promise<ProjectionResult<Invoice>> = adapter.select(Invoice, [])
const partial: ProjectedObject<Customer> = { id: 2, name: 'Alice' }
const column: ProjectionColumn = {
	path: 'customer', kind: 'object', objectType: Customer, objectFields: ['name']
}
const cells: readonly ProjectionCell[] = [
	{ kind: 'value', value: null },
	{ kind: 'value', value: undefined },
	{ kind: 'absent', at: 'customer' },
	{ kind: 'unloaded', reason: 'ignored' },
	{ kind: 'value', value: partial, loadedFields: ['name'] }
]
const row: ProjectionRow = { rootId: 1, cells }
const result: ProjectionResult<Invoice> = { rootType: Invoice, columns: [column], rows: [row] }
const empty: ProjectionResult<Invoice> = { rootType: Invoice, columns: [column], rows: [] }
const code: SelectionErrorCode = 'conversion'
const error = new SelectionError(code, 'customer.name', { cause: new Error('conversion failed') })
const sortPath: PropertyPath = new Reverse('number')

// A partial projection cannot masquerade as a complete entity.
// @ts-expect-error other is optional on the projected object
const complete: Entity<Customer> = partial
// @ts-expect-error value cells require an explicit value, including undefined
const missingValue: ProjectionCell = { kind: 'value' }
// @ts-expect-error absence must identify the absent relation
const missingPath: ProjectionCell = { kind: 'absent' }
// @ts-expect-error unloaded scalar conversion is explicitly ignored
const invalidReason: ProjectionCell = { kind: 'unloaded', reason: 'failed' }
// @ts-expect-error projection rows are not complete entities
const entities: Entity<Invoice>[] = result.rows
// @ts-expect-error selection paths do not include the legacy sort Reverse
const invalidPath: SelectionPath = sortPath
// @ts-expect-error columns are readonly
result.columns.push(column)
// @ts-expect-error ids are readonly
options.ids.push(4)
