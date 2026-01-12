import { ChevronDown, Mail, Map, MapPin, MessageCircleMore } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Tabs, TabsContent } from "./ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Listing } from "@/types/listing.type"
import { useMemo, useState } from "react"
import { joinWords, toCurrency } from "@/lib/helpers"
import { Button } from "./ui/button"
import { format } from "date-fns"

const ListingDetails: React.FC<{ listing: Listing }> = (handler) => {
  const listing = handler.listing

  const images = useMemo(
    () =>
      listing?.resources
        .filter((res) => res.type == "image")
        .sort((a, b) => (a.is_cover === b.is_cover ? 0 : a.is_cover ? -1 : 1)),
    [listing?.resources]
  )

  const [descLang, setDescLang] = useState<"en" | "hr">(
    listing?.service.description_hr ? "hr" : "en"
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-h-[80vh] overflow-auto flex-col">
        {/* {images?.length ? (
          // h-[23rem]
          <img
            src={images[0]?.resource}
            className="h-[23rem] mb-3.5 rounded-lg w-full object-cover"
          />
        ) : (
          <div className=" bg-gray-100 mb-3.5 rounded-lg w-full"></div>
        )} */}

        <Avatar className="h-[23rem] w-full rounded-lg mb-3.5">
          <AvatarImage src={images[0]?.resource} />
          <AvatarFallback className="rounded-lg" />
        </Avatar>

        <div className="flex gap-2.5 flex-wrap">
          {images?.map((each, i) => (
            <img
              src={each.resource}
              key={i + "image"}
              alt={each.name}
              className="rounded-lg h-[4rem]"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-3xl font-semibold text-start text-base-black flex items-center gap-5">
          {listing?.service.header}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-primary text-xl font-semibold">
          {toCurrency(listing.price)}
        </h3>
        <button className="text-xs font-medium text-primary flex gap-1 items-center">
          <Map className="stroke-base-black stroke-1" />
          View Map
        </button>
      </div>
      <p className="text-neutral-500 font-normal text-sm flex items-center gap-2">
        <MapPin />
        {listing.address}
      </p>
      {/* <div className="border-y flex border-[#E3E3E3] py-4 justify-between gap-4 text-neutral-500">
					  <div className="flex items-center gap-2">
						<MemoBed /> 3 Rooms
					  </div>
					  <div className="flex items-center gap-2">
						<MemoBath /> 2 Baths
					  </div>
					  <div className="flex items-center gap-2">
						<MemoExpand /> 45 m<>2</>
					  </div>
					</div> */}
      <div className="border rounded-lg p-4 flex flex-col gap-4">
        <h3 className="text-base-black text-xl font-semibold">
          Seller information
        </h3>
        <div className="flex items-center gap-2 text-neutral-800 text-lg">
          <Avatar className="size-10">
            <AvatarImage
              src={listing?.created_by.passport}
              className="object-cover"
              alt="Profile Image"
            />
            <AvatarFallback>{listing.created_by.initial}</AvatarFallback>
          </Avatar>
          <span>{listing.created_by.fullname}</span>
        </div>
        <p className="flex items-center text-lg text-neutral-800 gap-3">
          <Mail className="stroke-primary" />
          {listing.created_by.email}
        </p>
        <Button
          variant={"outline"}
          className="border-primary text-primary min-h-10"
        >
          Send a message <MessageCircleMore />
        </Button>
      </div>

      <div className="p-4 rounded-lg border flex flex-col gap-3">
        <Tabs value={descLang} defaultValue={"en"}>
          <div>
            <h3>Property description</h3>
            <p className="flex mt-2 items-center gap-2 divide-border text-xs text-neutral-700">
              <span>{descLang == "en" ? "English" : "Croatian"}</span>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-base-black border-l border-neutral-700 pl-2 flex items-center gap-2">
                  Languages <ChevronDown className="size-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {listing.service.description_en && (
                    <DropdownMenuItem onClick={() => setDescLang("en")}>
                      English
                    </DropdownMenuItem>
                  )}
                  {listing.service.description_hr && (
                    <DropdownMenuItem onClick={() => setDescLang("hr")}>
                      Croatian
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </p>
          </div>

          <TabsContent value="en">
            <p className="text-xs font-normal text-neutral-500 mb-2.5">
              {listing.service.description_en}
            </p>
          </TabsContent>
          <TabsContent value="hr">
            <p className="text-xs font-normal text-neutral-500 mb-2.5">
              {listing.service.description_hr}
            </p>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-2.5">
          <h3 className="text-xs font-semibold text-base-black">
            Key Features:
          </h3>

          <table>
            <tbody>
              {listing.features.map((each) => (
                <tr key={each.feature_field + listing.id}>
                  <td className="py-1.5 pr-4 flex text-base-black font-semibold text-xs min-w-24">
                    {each.label}
                  </td>
                  <td className="py-1.5 text-neutral-500 text-xs">
                    {each.type == "checkbox"
                      ? joinWords(each.value as string[])
                      : each.value}{" "}
                    {each.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ListingMapBox address={listing.address} />

      <div className="">
        <h3 className="mb-4 font-semibold text-xl text-neutral-700">
          Timeline
        </h3>
        <div className="flex justify-between gap-4 items-center text-neutral-600">
          <span className="font-medium flex items-center gap-2">
            <span className="size-5 rounded-full border-[6px] border-primary bg-white"></span>
            Submitted
          </span>
          <span>{format(listing.created_at, "do, MMM. hh:mma")}</span>
        </div>
        <div className="h-5 my-1 border-neutral-200 border-l-2 ml-2 border-dashed"></div>
        <div className="flex justify-between gap-4 items-center text-neutral-600">
          <span className="font-medium flex items-center gap-2">
            <span className="size-5 rounded-full border-[6px]  border-neutral-200 bg-white"></span>
            Approved
          </span>
          <span>-:-</span>
        </div>
      </div>
    </div>
  )
}

export default ListingDetails

import { Skeleton } from "@/components/ui/skeleton"
import ListingMapBox from "./ListingMapBox"

export const ListingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Main Image */}
      <Skeleton className="w-full h-80 rounded-lg" />

      {/* Thumbnails */}
      <div className="flex space-x-2">
        <Skeleton className="h-16 w-24 rounded-lg" />
        <Skeleton className="h-16 w-24 delay-150 rounded-lg" />
        <Skeleton className="h-16 w-24 rounded-lg" />
      </div>

      {/* Title */}
      <Skeleton className="h-6 delay-200 w-2/3" />

      {/* Price */}
      <Skeleton className="h-6 w-24" />

      {/* Location */}
      <Skeleton className="h-4 w-1/2" />

      {/* Seller Information */}
      <div className="p-4 border rounded-lg space-y-4">
        <div className="flex space-x-4">
          <Skeleton className="h-12 w-12 rounded-full delay-100" />
          <Skeleton className="h-6 w-1/3" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Property Description */}
      <div className="p-4 border rounded-lg space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 delay-300 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* map */}
      <Skeleton className="w-full h-72 rounded-lg" />

      {/* Timeline */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4 delay-100" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}
