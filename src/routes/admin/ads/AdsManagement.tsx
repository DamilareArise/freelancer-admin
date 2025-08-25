import { CustomTab } from "@/components/ui/tabs"
import Header from "@/components/widgets/Header"
import RouteHead from "@/components/widgets/RouteHead"
import { Outlet } from "react-router"

const AdsManagement = () => {
  return (
    <div className="flex flex-col gap-3">
      <Header />
      <div className="flex items-center justify-between gap-4">
        <RouteHead title="Premium listing & Ads" />
      </div>
      <CustomTab
        link
        tabs={[
          { label: "Overview", value: "overview" },
          { value: "super-ads-control", label: "Super Ads Control" },
          { label: "Super Ads List", value: "super" },
        ]}
      />
      <Outlet />
    </div>
  )
}

export default AdsManagement
