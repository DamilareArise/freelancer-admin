import RevenueDistroChart from "@/components/charts/RevenueDistroChart"
import SuperAdsChart from "@/components/charts/SuperAdsChart"
import InfoCard, { InfoCardProps } from "@/components/widgets/InfoCard"

const SubscriptionOverview = () => {
  return (
    <div className="pb-6">
      <div className="flex mt-4 flex-wrap gap-2">
        {(
          [
            { rate: -28, title: "Total Subscribers", value: 3445 },
            { rate: 21.8, title: "Active Subscribers", value: 2899 },
            { rate: 21.8, title: "Expiring Soon", value: 225 },
            { rate: 21.8, title: "Expiring Subscription", value: 325 },
          ] as InfoCardProps[]
        ).map((each) => (
          <div className="flex-1 min-w-40">
            <InfoCard {...each} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 lg:grid grid-cols-3 mt-4">
        <div className="col-span-2">
          <SuperAdsChart />
        </div>
        <div className="">
          <RevenueDistroChart />
        </div>
      </div>
    </div>
  )
}

export default SubscriptionOverview
