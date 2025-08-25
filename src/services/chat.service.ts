import { transformValidationResponse } from "@/lib/helpers"
import { Chat, Conversation } from "@/types/chat.type"
import { appApi } from "./app.service"
import { formatUser } from "./admin.service"

export interface ConversationFilter {
	role: "user" | "service_provider",
	adminId: number
}

export const formatConversation = (conversation: Conversation, adminId: number): Conversation => {
	let user = conversation.sender?.id == adminId ? conversation.receiver : conversation.sender;
	user = user ?? (conversation.sender ?? conversation.receiver);
	return {
		...conversation,
		user: user ? formatUser({
			...user,
			first_name: user.name?.split(' ')[0],
			last_name: user.name?.split(' ')[1],
		}) : conversation.user,
	}
}

export const chatApi = appApi.injectEndpoints({
	endpoints: (build) => ({
		createConversation: build.mutation({
			query: (body) => ({ url: 'support/conversations/', body, method: "POST" }),
			transformErrorResponse: transformValidationResponse,
			invalidatesTags: ["Conversation"]
		}),
		getConversations: build.query<Conversation[], ConversationFilter>({
			query: (params) => ({ url: 'support/support-conversation/', params }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: Conversation[], _, arg) => {
				return (response.map(each => ({
					...each,
					...formatConversation(each, arg.adminId)
				})))
			},
			providesTags: ["Conversation"]
		}),

		getChats: build.query<Chat[], { conversation: number }>({
			query: (params) => ({ url: 'support/chats/', params }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: Chat[]) => {
				return (response.map(each => ({
					...each,
					sender: formatUser({
						...each.sender,
						first_name: each.sender.name.split(' ')[0],
						last_name: each.sender.name.split(' ')[1],
					})
				})))
			},
			providesTags: ["Chat"]
		}),

		sendChat: build.mutation<Chat, {
			message: string,
			listing?: number,
			conversation: number,
		} & ConversationFilter>({
			query: (data) => ({
				url: 'support/chats/',
				body: data, params: { conversation: data.conversation }, method: "POST"
			}),
			transformErrorResponse: transformValidationResponse,
			onQueryStarted ({ conversation, adminId, role }, { dispatch, queryFulfilled }) {
				queryFulfilled.then(({ data }) => {
					dispatch(
						chatApi.util.updateQueryData('getChats', { conversation }, (chats) => {
							chats.push(data)
						})
					)

					dispatch(
						chatApi.util.updateQueryData('getConversations', { adminId, role }, (conversations) => {
							const index = conversations.findIndex(each => each.id == conversation);
							if (index >= 0) {
								conversations[index].last_message = {
									created_at: data.created_at,
									is_read: data.is_read,
									message: data.message,
									sender: data.sender.id
								}
							}
						})
					)
				}).catch(() => { })
			},
			invalidatesTags: ["Chat", "Conversation"]
		}),

	}),
	overrideExisting: false,
})

export const {
	useGetConversationsQuery, useCreateConversationMutation,
	useSendChatMutation, useGetChatsQuery
} = chatApi