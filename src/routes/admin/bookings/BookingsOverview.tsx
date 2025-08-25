import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import InfoCard from "@/components/widgets/InfoCard"
import Rating from "@/components/widgets/Rating"
import { useGetReviewsQuery } from "@/services/review.service"
import { Review } from "@/types/review.type"
import { format } from "date-fns"
import { FileWarningIcon, MapPin } from "lucide-react"

const BookingsOverview = () => {
  return (
    <div className="flex fade flex-col gap-4 mb-6">
      <div className="flex gap-2 flex-wrap mt-2">
        {[
          {
            value: 12,
            title: "Total Tours",
            rate: 28,
            desc: "from last month",
          },
          {
            value: 12,
            title: "Pending Approval",
            rate: -28,
            desc: "from last month",
          },
          {
            value: 12,
            title: "Completed Tours",
            rate: 28,
            desc: "from last month",
          },
          {
            value: 12,
            title: "Cancelled Tours",
            rate: -28,
            desc: "from last month",
          },
          {
            value: 12,
            title: "Rescheduled Tours",
            rate: -28,
            desc: "from last month",
          },
        ].map((each) => (
          <div key={each.title} className="flex-1 min-w-[15rem]">
            <InfoCard {...each} />
          </div>
        ))}
      </div>

      <Reviews />
    </div>
  )
}

export default BookingsOverview

const Reviews = () => {
  const { data, isLoading } = useGetReviewsQuery({ page: 1, limit: 10 })

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold">Reviews</h3>
      <div className="border flex flex-col gap-6 rounded-md p-4">
        {isLoading ? (
          <ReviewSkeleton />
        ) : (
          data?.results.map((review) => (
            <ReviewBox review={review} key={`review-box-${review.id}`} />
          ))
        )}
      </div>
    </div>
  )
}

const ReviewBox: React.FC<{ review: Review }> = ({ review }) => {
  const listing = review.booking.listing

  return (
    <div>
      <div className="flex gap-2 border-b border-dashed pb-4 mb-3">
        <Avatar className="size-12 rounded">
          <AvatarImage src={listing.images[0]?.resource} />
          <AvatarFallback className="rounded bg-primary/10">
            <FileWarningIcon className="text-primary stroke-1" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">{listing.property.header}</h3>
          <p className="flex text-xs gap-1 text-neutral-600">
            <MapPin className="size-4" /> {listing.address}
          </p>
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={review.reviewer.passport} alt="Profile Image" />
            <AvatarFallback className="text-neutral-500">
              {review.reviewer.initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col ">
            <h3 className="font-medium">{review.reviewer.fullname}</h3>
            <div className="flex gap-1.5 items-center text-[.76rem]">
              <Rating rating={review.rating} /> {review.rating}
            </div>
          </div>
        </div>
        <span className="text-sm text-neutral-500">
          {format(new Date(), "yyyy") == format(review.created_at, "yyyy")
            ? format(review.created_at, "dd MMM")
            : format(review.created_at, "dd MMM yyyy")}
        </span>
      </div>
    </div>
  )
}

const ReviewSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }, (_, index) => (
        <div key={`review-skeleton-${index}`}>
          <div className="flex gap-2 border-b border-dashed pb-4 mb-3">
            <Skeleton className="size-12 rounded" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center gap-1 text-xs text-neutral-600">
                <MapPin className="size-4 text-primary/10" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </>
  )
}
