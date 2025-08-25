export type MutationResponse<T> = {
	error: { message: string },
	data?: T
}

export interface ListResponse<T> {
	count: number
	results: T[]
}

export interface ListRequest {
	limit: number
	page: number
	search?: string
}
export interface Role {
	id: string;
	label: string;
	is_admin: boolean;
	description: string;
}
