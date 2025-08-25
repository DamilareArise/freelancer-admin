import SuperAdDialog from "@/components/dialogs/SuperAdDialog"
import MemoCrownStar from "@/components/icons/CrownStar"
import PricingCard, {
  PricingCardSkeleton,
} from "@/components/widgets/PricingCard"
import {
  superAdsCategoryMap,
  useGetSuperAdsQuery,
} from "@/services/superAd.service"
import { SuperAd } from "@/types/ad.type"
import { useState } from "react"

const SuperAdsControl = () => {
  const [superAdDialogIsOpen, setSuperAdDialogIsOpen] = useState(false)
  const [currentSuperAd, setCurrentSuperAd] = useState<SuperAd | null>(null)
  const { data: superAds, isLoading } = useGetSuperAdsQuery("")

  return (
    <>
      <div className="grid-cols-auto backdrop-opacity-20 sm:[--col-w:22rem] gap-5">
        {isLoading &&
          new Array(3)
            .fill(0)
            .map((_each, i) => <PricingCardSkeleton key={"Skeleton" + i} />)}
        {superAds?.map((each) => {
          const tier = superAdsCategoryMap[each.tier]
          return (
            <PricingCard
              key={each.id + "category"}
              headStyle={{
                color: tier.color,
                border: `1px solid ${tier.color}`,
                backgroundColor: `color-mix(in oklab, ${tier.color} 7%, transparent)`,
              }}
              onEdit={() => {
                setCurrentSuperAd(each)
                setSuperAdDialogIsOpen(true)
              }}
              pillStyle={{ color: tier.color, backgroundColor: tier.bg }}
              heading={each.title}
              icon={<MemoCrownStar className="size-4" />}
              title={`Tier ${each.tier}`}
              list={each.features}
              listHeading={"Features"}
              price={each.price}
            />
          )
        })}
      </div>

      <SuperAdDialog
        close={() => {
          setCurrentSuperAd(null)
          setSuperAdDialogIsOpen(false)
        }}
        open={superAdDialogIsOpen}
        superAd={currentSuperAd}
      />
    </>
  )
}

export default SuperAdsControl
