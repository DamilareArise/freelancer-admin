import SuperAdsCategoryBarChart from "@/components/charts/SuperAdsCategoryBarChart"
import SuperAdsChart from "@/components/charts/SuperAdsChart"
import InfoCard, { InfoCardProps } from "@/components/widgets/InfoCard"

const SuperAdsOverview = () => {
  return (
    <div className="pb-6">
      <div className="flex mt-4 flex-wrap gap-2">
        {(
          [
            { rate: -28, title: "Total Revenue", value: 3445, isAmount: true },
            { rate: 21.8, title: "Active Super Ads", value: 2899 },
            { rate: 21.8, title: "Expired Ads", value: 225 },
            { rate: 21.8, title: "Ads Ending Soon", value: 325 },
          ] as InfoCardProps[]
        ).map((each) => (
          <div className="flex-1 min-w-40">
            <InfoCard {...each} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 2xl:grid grid-cols-4 mt-4">
        <div className="col-span-2">
          <SuperAdsChart />
        </div>
        {/* <div className="col-span-2 flex flex-col gap-4 md:grid grid-cols-2"> */}
        {/* <RevenueDistroChart /> */}
        <div className="col-span-2">
          <SuperAdsCategoryBarChart />
        </div>
        {/* </div> */}
      </div>
    </div>
  )
}

export default SuperAdsOverview
