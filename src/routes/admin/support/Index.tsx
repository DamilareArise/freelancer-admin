import Header from "@/components/widgets/Header"
import InfoCard, { InfoCardSkeleton } from "@/components/widgets/InfoCard"
import { Outlet } from "react-router"
import * as Bread from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom"
import { Home } from "lucide-react"
import MemoSupport from "@/components/icons/Support"
import { useGetTicketsSummaryQuery } from "@/services/ticket.service"

const Support = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default Support

export const TicketsCardSummary = () => {
  const { data, isLoading } = useGetTicketsSummaryQuery("")

  return (
    <div className="flex gap-2 flex-wrap">
      {[
        {
          value: data?.total ?? 0,
          title: "Total Support Tickets Opened",
          rate: 0,
          desc: "from last month",
        },
        {
          value: data?.pending ?? 0,
          title: "Pending Tickets",
          rate: 0,
        },
        {
          value: data?.resolved ?? 0,
          title: "Resolved Tickets",
          rate: 0,
        },
        {
          value: data?.escalated ?? 0,
          title: "Escalated Cases",
          rate: 0,
        },
        {
          value: 0,
          title: "Flagged Service Providers/Users",
          rate: 0,
        },
      ].map((each) => (
        <div key={each.title} className="flex-1 min-w-[15rem]">
          {!isLoading ? (
            <InfoCard desc="from last month" {...each} />
          ) : (
            <InfoCardSkeleton />
          )}
        </div>
      ))}
    </div>
  )
}

export const SupportBreadcrumb = ({ page }: { page: string }) => {
  return (
    <Bread.Breadcrumb className="mt-2">
      <Bread.BreadcrumbList>
        <Bread.BreadcrumbItem>
          <Bread.BreadcrumbLink asChild>
            <Link to="/admin/overview">
              <Home /> Home
            </Link>
          </Bread.BreadcrumbLink>
        </Bread.BreadcrumbItem>
        <Bread.BreadcrumbSeparator />
        <Bread.BreadcrumbItem>
          <Bread.BreadcrumbLink asChild>
            <Link to="/admin/support/overview">
              <MemoSupport /> Support
            </Link>
          </Bread.BreadcrumbLink>
        </Bread.BreadcrumbItem>
        <Bread.BreadcrumbSeparator />
        <Bread.BreadcrumbItem>
          <Bread.BreadcrumbPage>{page}</Bread.BreadcrumbPage>
        </Bread.BreadcrumbItem>
      </Bread.BreadcrumbList>
    </Bread.Breadcrumb>
  )
}
