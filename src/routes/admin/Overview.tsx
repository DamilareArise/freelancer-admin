import CategoryChart from "@/components/charts/CategoryChart"
import Insights from "@/components/charts/Insights"
import UserActivity from "@/components/charts/UserActivity"
import Header from "@/components/widgets/Header"
import ListingSummary from "@/components/widgets/ListingSummary"
import RouteHead from "@/components/widgets/RouteHead"
// import Rive from "@rive-app/react-canvas"
// import logoRive from "../../assets/kliko_icon.riv"

function Overview() {
  return (
    <div className="pb-6">
      <Header />
      <div className="flex items-center justify-between gap-2 flex-wrap mb-5">
        <RouteHead title="Overview" />
      </div>
      {/* <div className="size-80">
        <Rive
          onPlay={(e) => {
            console.log(e.type)
          }}
          src={logoRive}
          stateMachines="bumpy"
        />
      </div> */}
      <ListingSummary />
      <div className="flex flex-col md:grid grid-cols-9 gap-5 mt-5">
        <div className="col-span-4">
          <UserActivity />
        </div>
        <div className="col-span-5">
          <CategoryChart />
        </div>
        <div className="col-span-full">
          <Insights />
        </div>
      </div>
    </div>
  )
}

export default Overview
