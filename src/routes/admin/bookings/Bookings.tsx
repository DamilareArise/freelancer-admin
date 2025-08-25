import { Button } from "@/components/ui/button"
import { CustomTab } from "@/components/ui/tabs"
import Header from "@/components/widgets/Header"
import RouteHead from "@/components/widgets/RouteHead"
import { Map, X } from "lucide-react"
import { useState } from "react"
import { Outlet } from "react-router"

const Bookings = () => {
  const [geoIsOpen, setGeoIsOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Header />
      <div className="flex items-center justify-between gap-4">
        <RouteHead title="Bookings & Physical Tour" />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <CustomTab
          link
          tabs={[
            { label: "Overview", value: "overview" },
            { value: "list", label: "Bookings/Tours" },
          ]}
        />

        <Button onClick={() => setGeoIsOpen(true)}>
          <Map className=" stroke-1.5" />
          Geo Location
        </Button>

        {geoIsOpen && (
          <div className="w-2xl fade z-10 bg-white right-6 top-5 fixed h-screen max-w-[calc(100vw_-_3rem)] max-h-[calc(100dvh_-_3rem)] border border-neutral-300 rounded-2xl">
            <div className="flex py-3 px-5 items-center justify-between gap-3">
              <h3 className="font-semibold text-neutral-700">Geo Location</h3>
              <button onClick={() => setGeoIsOpen(false)}>
                <X className="size-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  )
}

export default Bookings
