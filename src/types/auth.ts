import { documentSatusMap } from "@/services/user.service";
import { Role } from "./type";
import { Listing } from "./listing.type";
import { Booking } from "./booking.type";

export interface SignInData {
	password: string,
	email: string
}

export interface UserData {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	is_superuser?: boolean;
	phone: string;
	passport: string;
	status: "active" | "suspended";
	is_verified: boolean;
	created_at: Date;
	initial: string,
	fullname: string,
	user_roles: Role[],
	document_status: "pending" | "rejected" | "verified" | "submitted",
	document_type: keyof typeof documentSatusMap | null,
	auth_letter: string | null,
	business_reg: string | null,
	selfie: string | null,
	// document: string | null
	document_front: string | null
	document_back: string | null
	vat: string | null
	oib: string | null
}


export type FullUserData = Pick<UserData, 'id' | 'first_name' | 'last_name' | 'email' | 'status'> & {
	listings: Listing[],
	my_bookings: Booking[],
	incoming_bookings: Booking[],
	total_listings: number,
	document_status: string
}