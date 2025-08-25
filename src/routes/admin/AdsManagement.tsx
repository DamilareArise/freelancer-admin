import { Button } from "@/components/ui/button"
import Header from "@/components/widgets/Header"
import RouteHead from "@/components/widgets/RouteHead"

const AdsManagement = () => {
  return (
    <div>
      <Header />
      <div className="flex items-center justify-between gap-4">
        <RouteHead title="Premium listing & Ads" />
        <Button className="h-10 font-normal">
          {/* <span className="size-5 border-white rounded-md border flex items-center justify-center">
            <Plus />
          </span> */}
          Manage Super Ads
        </Button>
      </div>
    </div>
  )
}

export default AdsManagement
