import { UserData } from "./auth";
import { Booking } from "./booking.type";


export interface Review {
	id: number;
	booking: Booking,
	reviewer: Pick<UserData, 'first_name' | 'last_name' | 'passport' | 'id' | 'initial' | 'fullname' | 'email'>,
	created_at: string,
	rating: number,
	comment: string,
	impression: string,
}

