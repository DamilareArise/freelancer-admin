import { toCurrency } from "@/lib/helpers"
import { useGetSuperAdsQuery } from "@/services/superAd.service"
import { Check, X } from "lucide-react"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

const SuperAdCategoriesPopover = () => {
  const { data: superAdsCategories } = useGetSuperAdsQuery("")

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-10 font-normal">Manage Super Ads</Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        // draggable
        // popover="auto"
        // translate="no"
        className="fixessd flex flex-col gap-5 max-h-[calc(100dvh_-_12rem)] overflow-auto w-screen max-w-md px-5 pt-3 pb-6"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-lg">Manage Super Ads</h3>
          <button className="p-3">
            <X className="size-5" />
          </button>
        </div>
        {superAdsCategories?.map(({ title, price, features }, i) => (
          <div
            key={"Category" + i}
            className="rounded-2xl flex flex-col gap-5 p-3 border border-[#1818184D]"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-xl">{title}</h3>
              <h3 className="font-semibold text-lg">{toCurrency(price)}</h3>
            </div>
            <ul className="flex text-[#181818] flex-col gap-2">
              {features.map((feature) => (
                <li className="flex items-center gap-1" key={feature + i}>
                  <Check className="size-5" /> {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={"outline"}
              className="border-primary text-primary text-sm h-11"
            >
              Edit Price
            </Button>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}

export default SuperAdCategoriesPopover
