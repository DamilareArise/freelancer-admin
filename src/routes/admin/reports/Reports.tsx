import { CustomTab } from "@/components/ui/tabs"
import Header from "@/components/widgets/Header"
import RouteHead from "@/components/widgets/RouteHead"
import { Outlet } from "react-router"

const Reports = () => {
  return (
    <div className="flex flex-col gap-3 pb-10">
      <Header />
      <div className="flex items-center justify-between gap-4">
        <RouteHead title="Reports & Analytics" />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <CustomTab
          link
          tabs={[
            { label: "User Ananlytics", value: "user-analytics" },
            { label: "Listing Report", value: "listing" },
            { label: "Physical Tours", value: "physical-tours" },
            { label: "Super Ads Performance", value: "super-ads" },
          ]}
        />
      </div>

      <Outlet />
    </div>
  )
}

export default Reports
