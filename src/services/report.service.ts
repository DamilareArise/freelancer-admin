import { ListingSummary } from "@/types/listing.type"
import { appApi } from "./app.service"

export interface ActivityByCategory {
	data: {
		category: string;
		impression_count: number;
		users: number;
	}[];
	total_user: number;
}

export interface BookingByCategory {
	data: {
		category: string;
		booking_count: number;
	}[];
	total: number;
}

export interface PaymentPerTimeR {
	period?: Period,
	month?: number,
	year?: number
}

export type Period = "month" | "year" | "week"

const reportApi = appApi.injectEndpoints({
	endpoints: (build) => ({

		getListingSummary: build.query<ListingSummary, null>({
			query: () => ({ url: `summary/` }),
			providesTags: ["Listing", "SuperAd"]
		}),
		activitiesByCategory: build.query<ActivityByCategory, { period: Period }>({
			query: (params) => ({ url: `admin/reports/activity-by-category/`, params }),
			providesTags: ['Category']
		}),
		bookingsByCategory: build.query<BookingByCategory, { period: Period }>({
			query: (params) => ({ url: `admin/reports/bookings-by-category/`, params }),
			providesTags: ['Booking', 'Category']
		}),
		paymentPerTime: build.query<{
			years: number[],
			data: {
				label: string,
				total_payment: number
			}[]
		}, PaymentPerTimeR>({
			query: (params) => ({ url: `admin/reports/payment-per-time/`, params }),
			providesTags: ['Payment']
		}),

	}),
	overrideExisting: false,
})

export const { usePrefetch: useReportPrefetch, useGetListingSummaryQuery,
	useActivitiesByCategoryQuery, usePaymentPerTimeQuery, useBookingsByCategoryQuery
} = reportApi