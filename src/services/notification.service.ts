import { transformValidationResponse } from "@/lib/helpers"
import { ListRequest, ListResponse } from "@/types/type"
import { appApi } from "./app.service"
import { Notification } from "@/types/notification.type"

export const notificationApi = appApi.injectEndpoints({
	endpoints: (build) => ({
		addNotification: build.mutation({
			query: (body) => ({ url: 'notify/templates/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Notification"]
		}),
		getNotifications: build.query<ListResponse<Notification>, ListRequest>({
			query: (params) => ({ url: 'notify/templates/', params }),
			providesTags: ["Notification"]
		}),
		updateNotification: build.mutation({
			query: (body) => ({ url: `/notify/templates/${body.id}/`, body, method: "PUT" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Notification"]
		}),
		deleteNotification: build.mutation({
			query: (id) => ({ url: `notify/templates/${id}/`, method: "DELETE" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Notification"]

		}),
	}),
	overrideExisting: false,
})

export const { useGetNotificationsQuery, useDeleteNotificationMutation, useAddNotificationMutation, useUpdateNotificationMutation } = notificationApi