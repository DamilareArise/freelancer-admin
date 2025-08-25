import { CustomTab } from "@/components/ui/tabs"
import Header from "@/components/widgets/Header"
import RouteHead from "@/components/widgets/RouteHead"
import { Outlet } from "react-router"

const nav = [{ value: "charges", label: "Payment Charges" }]

const PaymentSettings = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-col gap-4">
        <RouteHead title="Payment Settings" />
        <CustomTab link tabs={nav} />
        <Outlet />
      </div>
    </div>
  )
}

export default PaymentSettings
