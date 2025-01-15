import { KeyOf, Type } from '@itrocks/class-type'
import { Entity, Identifier, MayEntity } from './entity'

export type SearchType<T extends object = object> = Partial<Record<KeyOf<T>, any>> & Record<string, any>

export { DataSource }
export default abstract class DataSource
{

	connectObject<T extends object>(object: MayEntity<T>, id: Identifier)
	{
		(object as Entity<T>).id = id
		return object as Entity<T>
	}

	abstract delete<T extends object>(object: Entity<T>, property: KeyOf<Entity<T>>): Promise<T>

	abstract deleteId<T extends object>(type: Type<T>, id: Identifier, property: KeyOf<Entity<T>>): void

	abstract deleteLink<T extends Entity>(object: T, property: KeyOf<T>, id: Identifier): void

	disconnectObject<T extends object>(object: Entity<T>): T
	{
		delete (object as Partial<Entity>).id
		return object
	}

	abstract insertLink<T extends Entity>(object: T, property: KeyOf<T>, id: Identifier): void

	isObjectConnected<T extends object>(object: MayEntity<T>): object is Entity<T>
	{
		return ('id' in object) && !!object.id
	}

	abstract read<T extends object>(type: Type<T>, id: Identifier): Promise<Entity<T>>

	abstract readCollection<T extends object, PT extends object>(
		object: Entity<T>, property: KeyOf<T>, type?: Type<PT>
	): Promise<Entity<PT>[]>

	abstract readCollectionIds<T extends object, PT extends object>(
		object: Entity<T>, property: KeyOf<T>, type?: Type<PT>
	): Promise<Identifier[]>

	abstract readMultiple<T extends object>(type: Type<T>, ids: Identifier[]): Promise<Entity<T>[]>

	abstract save<T extends object>(object: MayEntity<T>): Promise<Entity<T>>

	abstract search<T extends object>(type: Type<T>, search?: SearchType<T>): Promise<Entity<T>[]>

}
