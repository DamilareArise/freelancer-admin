import { SuperAd } from "./ad.type";
import { UserData } from "./auth";
import { Listing } from "./listing.type";

export interface Payment {
	id: number,
	status: "pending" | "canceled" | "failed" | "completed",
	due_date: string | null,
	created_at: string,
	transaction_id: string,
	price: number;
	amount_paid: number;
	listing: Pick<Listing, 'resources' | 'service' | 'images' | 'videos'> & {
		category: string,
		created_by: Pick<UserData, 'first_name' | 'last_name' | 'id' | 'passport' | 'initial' | 'fullname'>
	}
	super_ads?: Pick<SuperAd, 'tier' | 'price'> & {
		is_active: boolean
	}
}