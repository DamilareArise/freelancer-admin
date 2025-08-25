import AdsCategoryChart from "@/components/charts/AdsCategoryChart"
import AdsPerformanceChart from "@/components/charts/AdsPerformanceChart"
import InfoCard, { InfoCardProps } from "@/components/widgets/InfoCard"
const AdsOverview = () => {
  return (
    <div className="pb-6">
      <div className="flex mt-4 flex-wrap gap-2">
        {(
          [
            { rate: -28, title: "Active Ads", value: 126 },
            { rate: 21.8, title: "Expired Super ADs", value: 99 },
            { rate: 21.8, title: "Total Ads", value: 225 },
          ] as InfoCardProps[]
        ).map((each) => (
          <div className="flex-1 min-w-40">
            <InfoCard {...each} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 lg:grid grid-cols-3 mt-4">
        <div className="col-span-2">
          <AdsPerformanceChart />
        </div>
        <div className="">
          <AdsCategoryChart />
        </div>
      </div>
    </div>
  )
}

export default AdsOverview
