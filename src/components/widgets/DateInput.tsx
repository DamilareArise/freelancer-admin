import { CalendarIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "../ui/calendar"

const DateInput = ({
  date,
  max,
  min,
  setDate,
}: {
  date?: Date
  max?: Date
  min?: Date
  setDate: (date?: Date) => void
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal px-2",
            !date && "text-neutral-600"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "dd MMM yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          disabled={(date) =>
            (max ? date > max : false) || (min ? date < min : false)
          }
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
export default DateInput
