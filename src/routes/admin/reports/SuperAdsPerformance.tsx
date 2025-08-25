import AdsCategoryChart from "@/components/charts/AdsCategoryChart"
import Insights from "@/components/charts/Insights"
import SuperAdsChart from "@/components/charts/SuperAdsChart"
import RouteHead from "@/components/widgets/RouteHead"

const SuperAdsPerformance = () => {
  return (
    <div className="flex flex-col gap-5 @container">
      <div className="flex justify-between gap-3 flex-wrap items-center">
        <RouteHead
          className="text-base md:text-xl"
          title="Super Ads Performance"
        />
      </div>

      <div className="flex flex-col gap-6 @min-xl:grid grid-cols-3">
        <div className="col-span-2">
          <SuperAdsChart />
        </div>
        <div>
          <AdsCategoryChart />
        </div>
        <div className="col-span-full">
          <Insights />
        </div>
      </div>
    </div>
  )
}

export default SuperAdsPerformance
