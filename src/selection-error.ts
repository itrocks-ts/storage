
export type SelectionErrorCode =
	| 'ambiguous-type'
	| 'conversion'
	| 'invalid-path'
	| 'multiple-values'
	| 'unsupported-option'
	| 'unsupported-selection'

export class SelectionError extends Error
{

	constructor(readonly code: SelectionErrorCode, readonly path?: string, options?: ErrorOptions)
	{
		super(path === undefined ? code : `${code}: ${path}`, options)
		this.name = 'SelectionError'
	}

}
