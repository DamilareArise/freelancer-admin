import { transformValidationResponse } from "@/lib/helpers"
import { Ticket } from "@/types/ticket.type"
import { ListRequest, ListResponse } from "@/types/type"
import { formatUser } from "./admin.service"
import { appApi } from "./app.service"

export const formatTicket = (ticket: Ticket): Ticket => {
	return {
		...ticket,
		_id: `KLT${ticket.id.toString().padStart(3, "0")}`,
		complainant: formatUser({
			...ticket.complainant,
			first_name: ticket.complainant.name.split(' ')[0],
			last_name: ticket.complainant.name.split(' ')[1],
		}),

	}
}

const ticketApi = appApi.injectEndpoints({
	endpoints: (build) => ({

		getTickets: build.query<ListResponse<Ticket>, ListRequest & Partial<{
			status: Ticket['status']
		}>>({
			query: (params) => ({ url: 'support/support-ticket/', params }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: ListResponse<Ticket>) => ({
				...response,
				results: response.results.map(formatTicket)
			}),
			providesTags: ["Ticket"]
		}),

		getTicket: build.query<Ticket, Ticket['id']>({
			query: (id) => ({ url: `support/support-ticket/${id}/` }),
			transformErrorResponse: transformValidationResponse,
			transformResponse: (response: Ticket) => ({
				...response,
				_id: `KLT${response.id.toString().padStart(3, "0")}`,
				complainant: formatUser({
					...response.complainant,
					first_name: response.complainant.name.split(' ')[0],
					last_name: response.complainant.name.split(' ')[1]
				}),
			}),
			providesTags: ["Ticket"]
		}),

		getTicketsSummary: build.query<{
			total: number,
			opened: number,
			resolved: number,
			pending: number,
			escalated: number
		}, string>({
			query: () => ({ url: `support/ticket-summary/` }),
			providesTags: ["Ticket"]
		}),


	}),
	overrideExisting: false,
})

export const { useGetTicketsQuery, usePrefetch: useTicketPrefetch,
	useGetTicketQuery, useGetTicketsSummaryQuery
} = ticketApi