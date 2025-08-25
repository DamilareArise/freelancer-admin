import { transformValidationResponse } from "@/lib/helpers"
import { FAQ } from "@/types/faq.type"
import { appApi } from "./app.service"

export const faqApi = appApi.injectEndpoints({
	endpoints: (build) => ({
		addFaq: build.mutation({
			query: (body) => ({ url: 'admin/faq/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["FAQ"]
		}),
		getFaqs: build.query<FAQ[], string>({
			query: () => ({ url: 'admin/faq/' }),
			providesTags: ["FAQ"]
		}),
		updateFaq: build.mutation({
			query: (body) => ({ url: `/admin/faq/${body.id}/`, body, method: "PUT" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["FAQ"]
		}),
		deleteFaq: build.mutation({
			query: (id) => ({ url: `admin/faq/${id}/`, method: "DELETE" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["FAQ"]
		}),
	}),
	overrideExisting: false,
})

export const { useGetFaqsQuery, useDeleteFaqMutation, useAddFaqMutation, useUpdateFaqMutation } = faqApi