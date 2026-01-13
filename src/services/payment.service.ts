import { transformValidationResponse } from "@/lib/helpers"
import { Payment } from "@/types/payment.type"
import { appApi } from "./app.service"
import { ListResponse } from "@/types/type"
import { formatListing } from "./listing.service"

export interface PaymentFilter {
	limit: number,
	page: number,
	ad_type?: string,
	date_range: string[],
	search: string,
	status?: Payment['status'][]
}

export interface PaymentCharge {
	id: number;
	for_key: string;
	for_label: string;
	charge_percent: number;
	charge_fixed: number;
	created_at: string;
	updated_at: string;
	base_amount: number;
	for_all?: boolean;
}


export const paymentStatuses: Record<Payment["status"], { label: string }> = {
	pending: { label: "Pending" },
	completed: { label: "Completed" },
	failed: { label: "Failed" },
	canceled: { label: "Cancelled" },
}

const paymentApi = appApi.injectEndpoints({
	endpoints: (build) => ({
		getPayments: build.query<ListResponse<Payment>, PaymentFilter>({
			query: (params) => ({ url: 'pay/payment-list/', params }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: ListResponse<Payment>) => ({
				...response,
				results: response.results.map((each) => ({
					...each,
					listing: formatListing(each.listing)
				}))
			}),
			providesTags: ["Payment"]
		}),

		requeryPayment: build.mutation({
			query: (body) => ({ url: `pay/stripe/requery-payment/`, method: "POST", body }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Payment"]
		}),


		getCharges: build.query<PaymentCharge[], null>({
			query: () => ({ url: 'admin/charges/' }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: PaymentCharge[]) => response.map((charge) => ({
				...charge,
				for_all: charge.for_key.startsWith("all_category_"),
				base_amount: Number(charge.base_amount)
			})),
			providesTags: ["PaymentSetting"]
		}),

		updateCharge: build.mutation({
			query: (body) => ({ url: `admin/charges/${body.id}/`, method: "PATCH", body }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["PaymentSetting"]
		}),

	}),
	overrideExisting: false,
})

export const {
	useGetPaymentsQuery, usePrefetch: usePaymentPrefetch,
	useRequeryPaymentMutation, useUpdateChargeMutation, useGetChargesQuery
} = paymentApi