import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import React from "react"

const Rating: React.FC<{ rating: number }> = ({ rating }) => {
  // const [rating, setRating] = useState<number>(_defaultRating)
  // const [hover, setHover] = useState<number | null>(null)

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "size-3.5  transition-colors",
            // "cursor-pointer",
            rating > index ? "text-warning" : "text-neutral-300"
            // (hover ?? rating) > index ? "text-warning" : "text-gray-400"
          )}
          // onMouseEnter={() => setHover(index + 1)}
          // onMouseLeave={() => setHover(null)}
          // onClick={() => setRating(index + 1)}
          fill={rating > index ? "currentColor" : "none"}
          // fill={(hover ?? rating) > index ? "currentColor" : "none"}
        />
      ))}
    </div>
  )
}

export default Rating
