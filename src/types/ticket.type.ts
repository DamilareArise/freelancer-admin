
export interface TicketDialogProps {
	open?: boolean
	close: () => void
	ticket?: Ticket | null
}


export interface SupportType {
	id: string
	name: string
	description: string
}

export interface Ticket {
	id: string
	_id: string
	status: "pending" | "resolved" | "escalated"
	complainant: {
		id: number
		name: string
		passport?: string,
		initial: string,
	}
	created_at: string
	updated_at: string
	support_type: SupportType
}