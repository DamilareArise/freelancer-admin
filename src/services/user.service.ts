import { FullUserData, UserData } from "@/types/auth"
import { ListRequest, ListResponse, Role } from "@/types/type"
import { formatUser } from "./admin.service"
import { appApi } from "./app.service"
import { transformValidationResponse } from "@/lib/helpers"
import { formatListing } from "./listing.service"
import { formatBooking } from "./booking.service"

export type UsersFilters = Partial<{
	user_role: Pick<Role, "label" | "id">
	rating: [number, number]
}>

export type UsersFilterProps = {
	open: boolean
	filters: UsersFilters
	setFilters: (filters: UsersFilters) => void
	setOpen: (open: boolean) => void
}

export const documentSatusMap = {
	"passport": { label: "Passport", icon: "" },
	"id_card": { label: "ID Card", icon: "" },
	"driver_license": { label: "Driver License", icon: "" },
	"residence_permit": { label: "Residence Permit", icon: "" },
	"other": { label: "Other", icon: "" }
}

export const userApi = appApi.injectEndpoints({
	endpoints: (build) => ({
		getUsers: build.query<ListResponse<UserData>, ListRequest>({
			query: (params) => ({ url: 'all-user/user/', params }),
			transformResponse: ((data: ListResponse<UserData>) => ({
				...data,
				results: data.results.map(user => formatUser(user))
			})),
			providesTags: ["User"]
		}),

		getUser: build.query<FullUserData, { id: FullUserData['id'] }>({
			query: (params) => ({ url: `admin/user-listings-bookings/${params.id}/` }),
			transformResponse: (data: FullUserData) => (formatUser({
				...data,
				listings: data.listings.map(formatListing),
				my_bookings: data.my_bookings.map(formatBooking),
				incoming_bookings: data.incoming_bookings.map(formatBooking),
			})),
			providesTags: ["User"]
		}),

		updateUserDocStatus: build.mutation({
			query: (body) => ({ url: `admin/handle-doc-aproval/${body.user_id}/`, body, method: "PATCH" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["User"]
		}),

		updateUserStatus: build.mutation({
			query: (body) => ({ url: `handle-status/${body.user_id}/status-action/`, body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["User"]
		}),
	}),
	overrideExisting: false,
})

export const { useGetUsersQuery, useUpdateUserDocStatusMutation, usePrefetch: useUsersPrefetch,
	useGetUserQuery, useUpdateUserStatusMutation
} = userApi