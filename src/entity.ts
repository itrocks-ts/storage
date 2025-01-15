
export type Entity<T extends object = object> = T & { id: Identifier }
export type MayEntity<T extends object = object> = T | Entity<T>

export type Identifier = BigInt | Number | String
