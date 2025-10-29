

export interface Notification {
	id: number;
	types: ("email" | "in-app" | "push" | "in-app-banner" | "canceled")[],
	recipents: ("user" | "service-provider")[]
	category: string
	header: string
	created_at: string
	body: string,
	trigger_type: "immediately" | "recurring" | "custom",
	date: string,
	time: string
}

export interface NotificationDialogProps {
	open?: boolean
	close: () => void
	notification?: Notification | null
}
