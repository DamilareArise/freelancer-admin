import { transformValidationResponse } from "@/lib/helpers"
import { Review } from "@/types/review.type"
import { ListRequest, ListResponse } from "@/types/type"
import { formatUser } from "./admin.service"
import { appApi } from "./app.service"
import { formatBooking } from "./booking.service"

export const formatReview = (review: Review) => {
	return {
		...review,
		booking: formatBooking(review.booking),
		reviewer: formatUser(review.reviewer)
	}
}

const reviewApi = appApi.injectEndpoints({
	endpoints: (build) => ({

		getReviews: build.query<ListResponse<Review>, ListRequest & Partial<{
			listing_id: number
		}>>({
			query: (params) => ({ url: '/admin/get-reviews/', params }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: ListResponse<Review>) => ({
				...response,
				results: response.results.map(formatReview)
			}),
			providesTags: ["Review"]
		}),

		getReview: build.query<Review, Review['id']>({
			query: (id) => ({ url: `admin/get-reviews/${id}/` }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: Review) => ({
				...response,
				booking: formatBooking(response.booking),
				reviewer: formatUser(response.reviewer)
			}),
			providesTags: ["Review"]
		}),


	}),
	overrideExisting: false,
})

export const { useGetReviewsQuery, usePrefetch: useReviewPrefetch,
	useGetReviewQuery
} = reviewApi