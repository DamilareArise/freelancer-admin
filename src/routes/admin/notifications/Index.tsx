import { CustomTab } from "@/components/ui/tabs"
import Header from "@/components/widgets/Header"
import RouteHead from "@/components/widgets/RouteHead"
import { Outlet } from "react-router-dom"

const NotificationIndex = () => {
  return (
    <>
      <Header />
      <RouteHead title="Notifications" />
      <div className="flex flex-col my-4 gap-5 items-stretch">
        <CustomTab
          className="sticky top-20 bg-white z-10"
          link
          tabs={[
            { label: "App Notification", value: "app" },
            // { label: "Email Template", value: "email-template" },
          ]}
        />
        <Outlet />
      </div>
    </>
  )
}

export default NotificationIndex
