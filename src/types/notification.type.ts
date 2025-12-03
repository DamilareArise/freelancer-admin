

export interface Notification {
	id: number;
	types: ("email" | "in_app" | "push" | "in_app_banner" | "canceled")[],
	recipents: ("user" | "service_provider")[]
	category: string
	header: string
	created_at: string
	body: string,
	trigger_type: "immediately" | "recurring" | "custom",
	recurring_frequency: "daily" | "weekly" | "monthly",
	recurring_start: string,
	date: string,
	recurring_end: string,
	recurring_interval: number,
	// interval_value: string,
	time: string
}

export interface NotificationDialogProps {
	open?: boolean
	close: () => void
	notification?: Notification | null
}
