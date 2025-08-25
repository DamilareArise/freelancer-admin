import { transformValidationResponse } from "@/lib/helpers"
import { Listing, ListingSummary, SuperAdListing } from "@/types/listing.type"
import { ListRequest, ListResponse } from "@/types/type"
import { z } from "zod"
import { appApi } from "./app.service"
import { formatUser } from "./admin.service"
import { UserData } from "@/types/auth"

export const rejectionReasons = [
	"Poor Description",
	"Blurry Images",
	"Image Repitition",
	"Other",
] as const


export const rejectionForm = z.object({
	items: z.array(z.string())
		.min(1, {
			message: "You have to select at least one.",
		}).refine((value) => value.some((item) => item), {
			message: "You have to select at least one item.",
		}),
	other: z
		.string()
		.max(300, {
			message: "Message must not be longer than 3000 characters.",
		})
		.optional(),
})

export type RejectionFormType = z.infer<typeof rejectionForm>

interface ListingsResponse extends ListResponse<Listing> {
	rejected_count: number, pending_count: number
}

export type SuperListingsResponse = ListResponse<SuperAdListing>

export const formatListing = <T> (listing: T & Pick<Listing, 'resources'> & {
	created_by: Pick<UserData, 'first_name' | 'last_name'>,
	location?: Listing['location']
}) => {
	return ({
		...listing,
		created_by: formatUser(listing.created_by),
		images: listing.resources
			.filter((res) => res.type == "image")
			.sort((a, b) => (a.is_cover === b.is_cover ? 0 : a.is_cover ? -1 : 1)),
		videos: listing.resources
			.filter((res) => res.type == "video")
			.sort((a, b) => (a.is_cover === b.is_cover ? 0 : a.is_cover ? -1 : 1)),
		address: `${listing.location?.street_number} ${listing.location?.street_name}, ${listing.location?.city} ${listing.location?.county}. ${listing.location?.country}.`
	})
}

const listingApi = appApi.injectEndpoints({
	endpoints: (build) => ({
		addListing: build.mutation({
			query: (body) => ({ url: 'admin/listings/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
		}),
		updateListing: build.mutation({
			query: (body) => ({ url: `/user/listings/${body.id}/`, body, method: "PUT" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Listing"]
		}),
		updateListStatus: build.mutation({
			query: (body) => ({ url: `admin/handle-list-status/`, body, method: "PATCH" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Listing"]
		}),
		deleteListing: build.mutation({
			query: (id) => ({ url: `admin/listings/${id}/`, method: "DELETE" }),
			transformErrorResponse: transformValidationResponse,
			// onQueryStarted (id, { dispatch, queryFulfilled }) {
			// 	queryFulfilled.then(() => {
			// 		dispatch(
			// 			listingApi.util.updateQueryData('getListings', "", (listings) => {
			// 				listings = listings.filter(each => each.id != id)
			// 				return listings;
			// 			})
			// 		)
			// 	}).catch(() => { })
			// },
		}),
		setupListing: build.mutation({
			query: (body) => ({ url: 'admin/create-listing/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
			// onQueryStarted (_request, { dispatch, queryFulfilled }) {
			// 	const { data: createdPost } = await queryFulfilled
			//   const patchResult = dispatch(
			// 		api.util.upsertQueryData('getPost', id, createdPost),
			// 	)
			// queryFulfilled.then(({ data }) => {
			// 	dispatch(
			// 		listingApi.util.updateQueryData('getListings', "", (listings) => {
			// 			listings.unshift(data)
			// 		})
			// 	)
			// }).catch(() => { })
			// },
		}),
		getListing: build.query<Listing, string>({
			query: (id) => ({ url: `user/listings/${id}/` }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (listing: Listing) => formatListing(listing),
			providesTags: ["Listing"]
		}),
		getListings: build.query<ListingsResponse, ListRequest & Partial<{
			category_ids: string,
			price_range: string,
			status: Listing['status']
		}>>({
			query: (params) => ({ url: 'user/listings/', params }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: ListingsResponse) => ({
				...response,
				results: response.results.map(each => formatListing(each))
			}),
			providesTags: ["Listing"]
		}),

		getSuperAdListings: build.query<SuperListingsResponse, ListRequest & Partial<{
			category_ids: string,
			price_range: string,
			status: Listing['status']
		}>>({
			query: (params) => ({ url: 'user/superad-listings/', params }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: SuperListingsResponse) => ({
				...response,
				results: response.results.map(each => formatListing(each))
			}),
			providesTags: ["Listing", "SuperAd"]
		}),
		getSuperAdListing: build.query<Listing, number>({
			query: (id) => ({ url: `user/superad-listings/${id}/` }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: Listing) => formatListing(response),
			providesTags: ["Listing", "SuperAd"]
		}),

		getListingSummary: build.query<ListingSummary, null>({
			query: () => ({ url: `summary/` }),
			providesTags: ["Listing", "SuperAd"]
		}),


	}),
	overrideExisting: false,
})

export const { useAddListingMutation, useSetupListingMutation,
	useGetListingsQuery, useDeleteListingMutation, useUpdateListingMutation,
	useUpdateListStatusMutation, usePrefetch: useListingPrefetch,
	useGetListingQuery, useGetSuperAdListingsQuery, useGetListingSummaryQuery
} = listingApi