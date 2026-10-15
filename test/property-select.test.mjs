import assert                  from 'node:assert/strict'
import { createRequire }       from 'node:module'
import { test }                from 'node:test'
import { DataSource }          from '@itrocks/storage'
import { Identifiers }         from '@itrocks/storage'
import { Limit }               from '@itrocks/storage'
import { Option }              from '@itrocks/storage'
import { SelectionError }      from '@itrocks/storage'
import { Sort }                from '@itrocks/storage'

class Invoice
{
}

class LegacyAdapter extends DataSource
{

	searchCalls = 0

	async search()
	{
		this.searchCalls ++
		return [{ id: 1 }]
	}

}

test('existing adapter rejects projection asynchronously without an entity search fallback', async () => {
	const adapter = new LegacyAdapter()
	for (const columns of [[], ['number'], [['customer', 'name']]]) {
		const result = adapter.select(Invoice, columns)
		assert.ok(result instanceof Promise)
		await assert.rejects(result, error => {
			assert.ok(error instanceof SelectionError)
			assert.equal(error.code, 'unsupported-selection')
			assert.equal(error.path, undefined)
			return true
		})
	}
	assert.equal(adapter.searchCalls, 0)
	assert.deepEqual(await adapter.readAll(Invoice), [{ id: 1 }])
	assert.equal(adapter.searchCalls, 1)
})

test('identifiers use the existing option port and retain readonly-compatible identifier inputs', () => {
	const ids = Object.freeze([1, '2', 3n, 1])
	const option = new Identifiers(ids)
	assert.ok(option instanceof Option)
	assert.equal(option.ids, ids)
	assert.deepEqual(new Identifiers([]).ids, [])
	const options = [option, new Limit(0, 2), new Sort(['-number'])]
	assert.deepEqual(new LegacyAdapter().options(options), options)
	assert.deepEqual(new LegacyAdapter().options(option), [option])
})

test('public errors preserve every code, path and original cause', () => {
	const cause = new Error('driver or converter failure')
	for (const code of [
		'ambiguous-type', 'conversion', 'invalid-path', 'multiple-values', 'unsupported-option', 'unsupported-selection'
	]) {
		const error = new SelectionError(code, 'customer.name', { cause })
		assert.ok(error instanceof Error)
		assert.equal(error.name, 'SelectionError')
		assert.equal(error.code, code)
		assert.equal(error.path, 'customer.name')
		assert.equal(error.cause, cause)
		assert.match(error.message, /customer\.name/)
	}
	assert.equal(new SelectionError('unsupported-selection').message, 'unsupported-selection')
	assert.equal(Object.hasOwn(new SelectionError('invalid-path'), 'cause'), false)
})

test('projection-aware adapters substitute through the same public DataSource method', async () => {
	const result = {
		rootType: Invoice,
		columns: [{ path: 'number', kind: 'scalar' }],
		rows: [{ rootId: 1, cells: [{ kind: 'value', value: null }] }]
	}
	class ProjectionAdapter extends LegacyAdapter
	{

		async select(type, columns, search, options)
		{
			assert.equal(type, Invoice)
			assert.deepEqual(columns, ['number'])
			assert.deepEqual(search, { number: null })
			assert.ok(options instanceof Identifiers)
			return result
		}

	}
	const adapter = new ProjectionAdapter()
	assert.equal(await adapter.select(Invoice, ['number'], { number: null }, new Identifiers([1])), result)
	assert.equal(adapter.searchCalls, 0)
})

test('the package public facade resolves to this checkout and retains existing exports', () => {
	const require = createRequire(import.meta.url)
	assert.equal(require.resolve('@itrocks/storage'), new URL('../cjs/storage.js', import.meta.url).pathname)
	for (const name of ['DataSource', 'Identifiers', 'Limit', 'Option', 'SelectionError', 'Sort', 'dataSource', 'ds'])
		assert.ok(require('@itrocks/storage')[name], name)
})
