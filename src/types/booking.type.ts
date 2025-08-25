import { UserData } from "./auth";
import { Listing } from "./listing.type";


export interface Booking {
	id: number;
	status: "pending" | "confirmed" | "rejected" | "completed" | "canceled",
	listing: Listing,
	requester: Pick<UserData, 'first_name' | 'last_name' | 'passport' | 'id' | 'initial' | 'fullname' | 'email' | 'phone'>,
	contact_name: string,
	contact_phone: string,
	date_time: string
	created_at: string
}

