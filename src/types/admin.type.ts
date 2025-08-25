import { UserData } from "./auth"

export interface AdminDialogProps {
	open?: boolean
	close: () => void
	admin?: UserData | null
}
