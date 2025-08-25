import { shortNum } from "@/lib/helpers"
import {
  superAdsCategoryMap,
  useGetSuperAdsQuery,
} from "@/services/superAd.service"
import { SuperAd } from "@/types/ad.type"
import { Listing, SuperAdListing } from "@/types/listing.type"
import { ChevronDown, Ellipsis, View } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import ConfirmSuperAdCategoryChange from "./ConfirmSuperAdCategoryChange"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Skeleton } from "./ui/skeleton"
import StatusPill from "./widgets/StatusPill"

const SuperAdListingsTable = ({
  listings,
  isLoading = false,
}: {
  isLoading?: boolean
  listings: Listing[]
}) => {
  const { data: superAdsCategories } = useGetSuperAdsQuery("")
  const [selectedSuperAd, setSelectedSuperAd] = useState<SuperAd | undefined>()
  const [currentListing, setCurrentListing] = useState<
    SuperAdListing | undefined
  >()
  const [confirmStatusChangeIsOpen, setConfirmStatusChangeIsOpen] =
    useState(false)

  return (
    <>
      <div className="overflow-auto border-t border-x rounded-2xl text-neutral-800 font-medium">
        <table className="w-full">
          <thead>
            <tr className="thead-row">
              <th>Property</th>
              <th>Super Ads Category</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              listings.map((each, i) => (
                <tr className="tbody-row" key={i + "paymentAll"}>
                  <td>
                    <span className="flex gap-2 items-center">
                      {each.resources.find((res) => res.type == "image") ? (
                        <img
                          src={
                            each.resources.find((res) => res.type == "image")
                              ?.resource
                          }
                          className="rounded-full size-6 object-cover"
                        />
                      ) : (
                        <div className="bg-neutral-100 size-6 rounded-full"></div>
                      )}
                      <span>{each.property.header}</span>
                    </span>
                  </td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="rounded-full">
                        {each.super_ad?.super_ads_category && (
                          <StatusPill
                            noIcon
                            className="py-1.5 px-2.5 text-xs"
                            color={
                              superAdsCategoryMap[
                                each.super_ad?.super_ads_category?.tier
                              ].color
                            }
                            label={
                              <span className="flex gap-1 items-center">
                                {each.super_ad?.super_ads_category?.title}
                                <ChevronDown className="size-4" />
                              </span>
                            }
                            status={"pending"}
                          />
                        )}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {superAdsCategories?.map((cat) => (
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentListing(each as SuperAdListing)
                              setSelectedSuperAd(cat)
                              setConfirmStatusChangeIsOpen(true)
                            }}
                            style={{
                              color: superAdsCategoryMap[cat.tier].color,
                            }}
                            key={cat.id + "sac"}
                          >
                            {cat.title}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem asChild></DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td>{shortNum(each.impressions)}</td>
                  <td>{shortNum(each.clicks)}</td>
                  <td>
                    {each.super_ad?.end_date
                      ? new Date(each.super_ad?.end_date).toDateString()
                      : "--"}
                  </td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex size-8 items-center">
                        <Ellipsis />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link to={`/admin/ads/super/${each.id}`}>
                          <DropdownMenuItem>
                            <View /> View Listing
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}

            {isLoading &&
              new Array(8).fill(null).map((_, i) => (
                <tr className="tbody-row" key={i + "skeleton"}>
                  <td className="flex gap-2 items-center">
                    <Skeleton className="size-10 rounded-full" />
                    <Skeleton className="h-3 w-40" />
                  </td>
                  <td>
                    <Skeleton className="h-3 w-48" />
                  </td>
                  <td>
                    <Skeleton className="h-3 w-40" />
                  </td>
                  <td>
                    <Skeleton className="h-3 w-32" />
                  </td>
                  <td>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </td>
                  <td>
                    <Skeleton className="h-2 w-9" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {currentListing && selectedSuperAd && (
        <ConfirmSuperAdCategoryChange
          open={confirmStatusChangeIsOpen}
          onOpenChange={setConfirmStatusChangeIsOpen}
          listing={currentListing}
          superAd={selectedSuperAd}
        />
      )}
    </>
  )
}

export default SuperAdListingsTable
