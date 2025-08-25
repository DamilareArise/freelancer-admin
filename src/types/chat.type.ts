
export interface Conversation {
	id: number;
	sender: User | null;
	status: string;
	type: string;
	created_at: string;
	updated_at: string;
	receiver: User | null;
	user: User;
	last_message: {
		message: string,
		created_at: string
		is_read: boolean,
		sender: number
	} | null
}

interface User {
	id: number;
	name: string;
	initial: string;
	passport: string;
}

export interface Chat {
	id: number;
	sender: User;
	conversation: number;
	message: string;
	is_read: boolean;
	resource: null;
	created_at: string;
	updated_at: string;
	listing: number | null;
}
