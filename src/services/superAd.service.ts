import { transformValidationResponse } from "@/lib/helpers"
import { SuperAd, } from "@/types/ad.type"
import { appApi } from "./app.service"


export const superAdsFeatures = [
	{ label: "Featured on Homepage", value: "Featured on Homepage" },
	{ label: "Highest Visibility", value: "Highest Visibility" },
	{ label: "30 Day Duration", value: "30-Day Duration" },
	{ label: "More Clicks & Views", value: "More Clicks & Views" }
]

export const superAdsCategoryMap: Record<number, { label: string, color: string, bg: string }> = {
	1: {
		label: "Tier 1", color: "var(--primary)",
		bg: "var(--primary-200)",
	},
	2: { label: "Tier 2", color: "var(--warning)", bg: "#FFECCC", },
	3: { label: "Tier 3", color: "#9747FF", bg: "#E4D0FF", },
}

export const superAdApi = appApi.injectEndpoints({
	endpoints: (build) => ({
		getSuperAds: build.query<SuperAd[], string>({
			query: () => ({ url: 'ads/super-ads-categories/' }),
			providesTags: ["SuperAd"],
		}),
		changeAdStatus: build.mutation({
			query: (body) => ({ url: `admin/superad-status/${body.id}/`, body, method: "PATCH" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["SuperAd", "Listing"],
		}),
		deleteAd: build.mutation({
			query: (id) => ({ url: `admin/delete-superad/${id}/`, method: "DELETE" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["SuperAd", "Listing"],
		}),
		updateSuperAd: build.mutation({
			query: (body) => ({ url: `ads/super-ads-categories/${body.id}/`, body, method: "PUT" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["SuperAd"]
		}),
		extendAd: build.mutation({
			query: (body) => ({ url: `/admin/extend-superad/${body.id}/`, body, method: "PATCH" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["SuperAd", "Listing"]
		}),
		changeSuperAdCategory: build.mutation({
			query: (body) => ({ url: `/admin/change-superad/${body.id}/`, body, method: "PATCH" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["SuperAd", "Listing"]
		}),
	}),
	overrideExisting: false,
})

export const {
	useGetSuperAdsQuery, useUpdateSuperAdMutation, useChangeSuperAdCategoryMutation,
	useExtendAdMutation, useChangeAdStatusMutation, useDeleteAdMutation
} = superAdApi