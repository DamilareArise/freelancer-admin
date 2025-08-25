import { CustomTab } from "@/components/ui/tabs"
import Header from "@/components/widgets/Header"
import RouteHead from "@/components/widgets/RouteHead"
import { Outlet } from "react-router"

const nav = [
  { value: "subscription-overview", label: "Subscription Overview" },
  // { value: "subscription-control", label: "Subscription Control" },
  { value: "super-ads-overview", label: "Super Ads" },
]

const FinOverview = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-col gap-4">
        <RouteHead title="Financials" />
        <CustomTab link tabs={nav} />
        <Outlet />
      </div>
    </div>
  )
}

export default FinOverview
