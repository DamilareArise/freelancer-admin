import { transformValidationResponse } from "@/lib/helpers"
import { Booking } from "@/types/booking.type"
import { ListRequest, ListResponse } from "@/types/type"
import { appApi } from "./app.service"
import { formatListing } from "./listing.service"
import { formatUser } from "./admin.service"

export const formatBooking = (booking: Booking) => {
	return {
		...booking, listing: formatListing(booking.listing),
		requester: formatUser(booking.requester)
	}
}

const bookingApi = appApi.injectEndpoints({
	endpoints: (build) => ({

		getBookings: build.query<ListResponse<Booking>, ListRequest & Partial<{
			status: Booking['status']
		}>>({
			query: (params) => ({ url: 'admin/bookings/', params }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: ListResponse<Booking>) => ({
				...response,
				results: response.results.map(formatBooking)
			}),
			providesTags: ["Booking"]
		}),

		getBooking: build.query<Booking, Booking['id']>({
			query: (id) => ({ url: `admin/bookings/${id}/` }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: Booking) => ({
				...response,
				listing: formatListing(response.listing),
				requester: formatUser(response.requester)
			}),
			providesTags: ["Booking"]
		}),


	}),
	overrideExisting: false,
})

export const { useGetBookingsQuery, usePrefetch: useBookingPrefetch,
	useGetBookingQuery
} = bookingApi