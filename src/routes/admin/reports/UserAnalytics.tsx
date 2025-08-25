import AccountDeletionLineChart, {
  AccountDeletionDoughnut,
} from "@/components/charts/AccountDeletionChart"
import UserActivity from "@/components/charts/UserActivity"
import UserRegistrationLineChart, {
  UserRegistrationDoughnut,
} from "@/components/charts/UserRegistrationChart"
import RouteHead from "@/components/widgets/RouteHead"

const UserAnalytics = () => {
  return (
    <div className="flex flex-col gap-5 @container">
      <div className="flex justify-between gap-3 flex-wrap items-center">
        <RouteHead className="text-base md:text-xl" title="User Analytics" />
        {/* <div className="flex items-center gap-2 flex-wrap">
          <button className="flex border items-center text-[#56606D] text-sm  gap-2 rounded-md px-2.5 py-2">
            <Download className="size-4" /> Export as CSV
          </button>
          <button className="flex border items-center text-[#56606D] text-sm  gap-2 rounded-md px-2.5 py-2">
            <Download className="size-4" /> Export as PDF
          </button>
        </div> */}
      </div>

      <div className="flex flex-col gap-6 @min-xl:grid grid-cols-3">
        <div className="col-span-2">
          <UserRegistrationLineChart />
        </div>
        <div>
          <UserRegistrationDoughnut />
        </div>
        <div className="col-span-full">
          <UserActivity by="location" />
        </div>
        <div className="col-span-2">
          <AccountDeletionLineChart />
        </div>
        <div>
          <AccountDeletionDoughnut />
        </div>
      </div>
    </div>
  )
}

export default UserAnalytics
