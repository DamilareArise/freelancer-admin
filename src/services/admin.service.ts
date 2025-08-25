import { transformValidationResponse } from "@/lib/helpers"
import { UserData } from "@/types/auth"
import { ListRequest, ListResponse } from "@/types/type"
import { appApi } from "./app.service"

export const formatUser = <T> (user: T & Pick<UserData, 'first_name' | 'last_name'>) => {
	return ({
		...user,
		initial: `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`,
		fullname: `${user.first_name} ${user.last_name}`,
		// passport: `${BURL}${user.passport}`
	})
}

export const adminApi = appApi.injectEndpoints({
	endpoints: (build) => ({
		addAdmin: build.mutation({
			query: (body) => ({ url: 'admin/handle-admin/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["AdminUser"]
		}),
		getAdmins: build.query<ListResponse<UserData>, ListRequest>({
			// query: (params) => ({ url: 'admin/handle-admin/', params }),
			query: (params) => ({ url: 'all-user/admin/', params }),
			transformResponse: ((data: ListResponse<UserData>) => ({
				...data,
				results: data.results.map(user => formatUser(user))
			})),
			providesTags: ["AdminUser"]
		}),
		updateAdmin: build.mutation({
			query: (body) => ({ url: `/admin/handle-admin/${body.id}/`, body, method: "PUT" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["AdminUser"]
		}),
		deleteAdmin: build.mutation({
			query: (id) => ({ url: `admin/handle-admin/${id}/`, method: "DELETE" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["AdminUser"]
			// onQueryStarted (id, { dispatch, queryFulfilled }) {
			// 	queryFulfilled.then(() => {
			// 		dispatch(
			// 			adminApi.util.updateQueryData('getAdmins', "", (categories) => {
			// 				categories = categories.filter(each => each.id != id)
			// 				return categories;
			// 			})
			// 		)
			// 	}).catch(() => { })
			// },
		}),
	}),
	overrideExisting: false,
})

export const { useGetAdminsQuery, useDeleteAdminMutation, useAddAdminMutation, useUpdateAdminMutation } = adminApi