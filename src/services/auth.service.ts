import { transformValidationResponse } from "@/lib/helpers"
import { UserData } from "@/types/auth"
import { appApi } from "./app.service"

const authApi = appApi.injectEndpoints({
	endpoints: (build) => ({
		signIn: build.mutation({
			query: (body) => ({ url: 'admin/login/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Admin"]
		}),
		verifyResetOtp: build.mutation({
			query: (body) => ({ url: 'verify-otp/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Admin"]
		}),
		requestPasswordReset: build.mutation({
			query: (body) => ({ url: 'password-reset/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Admin"]
		}),
		resetPassword: build.mutation({
			query: (body) => ({ url: 'password-reset-confirm/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Admin"]
		}),
		updateAuthAdmin: build.mutation({
			query: (body) => ({ url: 'update-user/', body, method: "PUT" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Admin"]
		}),
		adminLogout: build.mutation({
			query: (body) => ({ url: 'logout/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Admin"]
		}),
		updateAdminPassword: build.mutation({
			query: (body) => ({ url: 'change-password/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
		}),
		getAdmin: build.query<UserData, unknown>({
			query: () => 'get-user/',
			transformResponse: ((user: UserData) => ({
				...user,
				initial: `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`,
				fullname: `${user.first_name} ${user.last_name}`,
			})),
			providesTags: ["Admin"]
		}),
	}),
	overrideExisting: false,
})

export const {
	useSignInMutation, useGetAdminQuery, useUpdateAuthAdminMutation,
	useUpdateAdminPasswordMutation, useAdminLogoutMutation,
	useRequestPasswordResetMutation, useResetPasswordMutation,
	useVerifyResetOtpMutation
} = authApi