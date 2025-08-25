import { CustomTab } from "@/components/ui/tabs"
import Header from "@/components/widgets/Header"
import RouteHead from "@/components/widgets/RouteHead"
import { Outlet } from "react-router"

const nav = [
  { value: "subscription-payments", label: "Subscription Payments" },
  { value: "super-ads-payments", label: "Super Ads Payment" },
  { value: "service-payments", label: "Service Payments" },
]

const PaymentProcessing = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-col gap-4">
        <RouteHead title="Payments" />
        <CustomTab link tabs={nav} />
        <Outlet />
      </div>
    </div>
  )
}

export default PaymentProcessing
