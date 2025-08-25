import { transformValidationResponse } from "@/lib/helpers"
import { appApi } from "./app.service"
import { Category, CreateCategory } from "@/types/category.type"

const categoryApi = appApi.injectEndpoints({
	endpoints: (build) => ({
		addCategory: build.mutation({
			query: (body) => ({ url: 'admin/categories/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
		}),
		updateCategory: build.mutation({
			query: (body) => ({ url: `/admin/update-category/${body.id}/`, body, method: "PUT" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Category"]
		}),
		deleteCategory: build.mutation({
			query: (id) => ({ url: `admin/categories/${id}/`, method: "DELETE" }),
			transformErrorResponse: transformValidationResponse,
			onQueryStarted (id, { dispatch, queryFulfilled }) {
				queryFulfilled.then(() => {
					dispatch(
						categoryApi.util.updateQueryData('getCategories', "", (categories) => {
							categories = categories.filter(each => each.id != id)
							return categories;
						})
					)
				}).catch(() => { })
			},
			invalidatesTags: ["Category"]
		}),
		setupCategory: build.mutation<Category, CreateCategory>({
			query: (body) => ({ url: 'admin/create-category/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
			onQueryStarted (_request, { dispatch, queryFulfilled }) {
				// 	const { data: createdPost } = await queryFulfilled
				//   const patchResult = dispatch(
				// 		api.util.upsertQueryData('getPost', id, createdPost),
				// 	)
				queryFulfilled.then(({ data }) => {
					dispatch(
						categoryApi.util.updateQueryData('getCategories', "", (categories) => {
							categories.unshift(data)
						})
					)
				}).catch(() => { })
			},
			invalidatesTags: ["Category"]
		}),
		getCategories: build.query<Category[], string>({
			query: () => ({ url: 'admin/categories/' }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: Category[]) => response.map((each) => ({ ...each, checked: true })),
			providesTags: ["Category"]
		}),
		getCategory: build.query<Category, Category["id"]>({
			query: (id) => ({ url: `admin/categories/${id}/` }),
			transformErrorResponse: transformValidationResponse,
			providesTags: ["Category"]
		}),
	}),
	overrideExisting: false,
})

export const { useAddCategoryMutation, useSetupCategoryMutation,
	useGetCategoriesQuery, useDeleteCategoryMutation, useUpdateCategoryMutation,
	useGetCategoryQuery
} = categoryApi