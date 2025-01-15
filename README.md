[![npm version](https://img.shields.io/npm/v/@itrocks/storage?logo=npm)](https://www.npmjs.org/package/@itrocks/storage)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/storage)](https://www.npmjs.org/package/@itrocks/storage)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/storage?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/storage)
[![issues](https://img.shields.io/github/issues/itrocks-ts/storage)](https://github.com/itrocks-ts/storage/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# storage

Transforms model objects to and from storage systems.

## Overview

`@itrocks/storage` is an abstraction layer module offering a unified API for managing data across various storage
systems, such as databases, files, or APIs.
It simplifies CRUD operations and object relationship handling, independent of the underlying data source.

## Core components

- [DataSource](#datasource):
  The core abstraction for connecting to and performing operations on a storage system.
  It provides generic CRUD methods and is designed to be extended for specific storage implementations
  (e.g., MySQL, PostgreSQL, files, or even APIs).

- [Entity](#entity):
  An `Entity` represents a model object linked to a persistent resource in the storage system, such as after reading
  or writing it using data source features.
  Each `Entity` is expected to have a unique [Identifier](#identifier) (`id`).

- [SearchType](#searchtype):
  A flexible object query structure used to define search criteria for finding entities in the storage.

## Installation

```bash
npm i @itrocks/storage
```

## Basic usage

### Setting up a data source

To set up a data source, use the `create` function,
which initializes a [DataSource](#datasource) based on a configuration object and registers it under a specific name.

```ts
import { create, ds } from '@itrocks/storage'

// Configure a main MySQL data source
create({
	engine:   '@itrocks/mysql',
	host:     'localhost',
	user:     'root',
	password: 'password',
	database: 'example_db'
})

// Access the default (main) data source
const dataSource = ds()
```

### CRUD Operations

The following example demonstrates common data access patterns:

```ts
// Saving an Entity
await dataSource.save(new User({ name: 'John Doe' }))

// Reading an Entity by ID
const user = await dataSource.read(User, 1)

// Searching for Entities
const activeUsers = await dataSource.search(User, { active: true })

// Deleting an Entity
await dataSource.delete(user)
```

## Creating a Custom Data Source

To create a custom data source implementation, extend the [DataSource](#datasource) abstract class
and implement its methods:

```ts
import { KeyOf, Type }        from '@itrocks/class-type'
import { DataSource, Entity } from '@itrocks/storage'

export default class MyCustomDataSource extends DataSource
{
	constructor(configuration: { someConfigOption: string })
	{
		super()
		// Save custom configuration
	}
	async delete<T extends object>(object: Entity<T>, property: KeyOf<Entity<T>> = 'id'): Promise<T> {
		// Custom delete logic
	}
	async read<T extends object>(type: Type<T>, id: Identifier): Promise<Entity<T>> {
		// Custom read logic
	}
	async save<T extends object>(object: MayEntity<T>): Promise<Entity<T>> {
		// Custom save logic
	}
	async search<T extends object>(type: Type<T>, search: SearchType<T> = {}): Promise<Entity<T>[]> {
		// Custom search logic
	}
	// Implement other abstract methods
}
```

## Registering the Custom Data Source

Once your custom [DataSource](#datasource) is implemented, register it using the [create](#create) function:

```ts
create({
	engine: './my-custom-data-source',
	someConfigOption: 'value'
})
```

## Storage manager Functions API

### create

```ts
create(config: object, dataSource: string = 'main'): DataSource
```

Creates and registers a new [DataSource](#datasource).

**Parameters:**
- `config`:
  Configuration object for the data source.
- `dataSource`:
  (Optional) Name of the data source. Defaults to `'main'`.

**Returns:**
The registered [DataSource](#datasource).

### ds

```ts
ds(dataSource: string = 'main'): DataSource
```

Alias for [get](#get).
Retrieves a registered [DataSource](#datasource) by name.

### get

```ts
get(dataSource: string = 'main'): DataSource
```

Retrieves a registered [DataSource](#datasource) by name.

## Entity Types API

### Entity

```ts
type Entity<T extends object = object> = T & { id: Identifier }
```

A model object linked to stored data though an [Identifier](#identifier).

### Identifier

```ts
type Identifier = BigInt | Number | String
```

The identifier of the stored version of the model object.
It is unique for each model object [type](https://github.com/itrocks-ts/class-type#type).

### MayEntity

```ts
type MayEntity<T extends object = object> = T | Entity<T>
```

A model object that may or may not be linked to stored data.

## DataSource API

### delete

```ts
delete(object: Entity<T>): Promise<T>
```

Deletes an entity from the storage.

**Parameters:**
- `object`:
  The model object, as an [Entity](#entity) linked to a data source storage entry.

**Returns:**
The object is returned without its [Identifier](#identifier)
because it no longer matches a stored [Entity](#entity) after deletion.

### read

```ts
read(type: Type<T>, id: Identifier): Promise<Entity<T>>
```

Reads an [Entity](#entity) from the storage, by its identifier.

**Parameters:**
- `type`:
  The [class Type](https://github.com/itrocks-ts/class-type#type) of the [Entity](#entity) to be read.
- `id`:
  The [Identifier](#identifier) of the [Entity](#entity) in the storage.

**Returns:**
A promise resolving to the [Entity](#entity) read from storage.

### readCollection

```ts
readCollection(object: Entity<T>, property: KeyOf<T>, type?: Type<PT>): Promise<Entity<PT>[]>
```

Reads a collection of related entities.

**Parameters:**
- `object`:
  The [Entity](#entity) model object related to the collection to be read.
- `property`:
  The name of the property linking to the collection.
- `type`: (Optional)
  The [class Type](https://github.com/itrocks-ts/class-type#type) of the collection objects.

**Returns:**
An array of [Entity](#entity) objects matching the property `type`.

### save

```ts
save(object: MayEntity<T>): Promise<Entity<T>>
```

Saves an entity.
If the `object` is not an [Entity](#entity),
it will be inserted into the storage and transformed into an [Entity](#entity).

**Parameters:**
- `object`:
  The model object to save into the storage.

**Returns:**
The saved [Entity](#entity).

### search

```ts
search(type: Type<T>, search?: SearchType<T>): Promise<Entity<T>[]>
```

Searches for [entities](#entity) matching the criteria.

**Parameters:**
- `type`:
  The [class Type](https://github.com/itrocks-ts/class-type#type) of the [entities](#entity) to search.
- `search`:
  The search criteria as a flexible [query object](#searchtype).

## SearchType

```ts
export type SearchType<T extends object = object> = Partial<Record<KeyOf<T>, any>> & Record<string, any>
```

A `SearchType` is an object used to define search criteria for finding entities in the storage system.
It maps property names of the target entity to the corresponding values to search for.
This allows flexible and dynamic queries based on the properties and their expected values.

## Planned Enhancements

- **Property Paths**:
  In future versions, [SearchType](#searchtype) will support advanced search criteria using property paths.
  For example, to search for a User whose friends' birth city is "Paris": `{ 'friends.birthCity.name': 'Paris' }`.
  This will simplify querying related objects.

- **Search Functions**:
  The SearchType will also support functions for more complex criteria beyond simple equality.
  Examples include: `{ birthDate: duringYear(1976), age: greaterThan(48) }`
  
Combining these features will be possible, such as: `{ 'friends.birthDate': before(new Date('1976-04-25')) }.`
