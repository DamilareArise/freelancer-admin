import { CustomTab } from "@/components/ui/tabs"
import Header from "@/components/widgets/Header"
import RouteHead from "@/components/widgets/RouteHead"
import { Outlet } from "react-router-dom"

const Listings = () => {
  return (
    <>
      <Header />
      <RouteHead title="Listings" />
      <div className="flex flex-col my-8 gap-5 items-stretch">
        <CustomTab
          className="sticky top-20 bg-white z-10"
          link
          tabs={[
            { label: "Listing management", value: "management" },
            { label: "Listing categories", value: "categories" },
          ]}
        />
        <Outlet />
      </div>
    </>
  )
}

export default Listings
