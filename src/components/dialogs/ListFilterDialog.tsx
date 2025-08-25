import { currency, filter, ratings, shortNum } from "@/lib/helpers"
import { useGetCategoriesQuery } from "@/services/category.service"
import { countriesWithCode } from "@/services/country.service"
import { X } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { DualRangeSlider } from "../ui/dual-range-slider"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import SearchInput from "../widgets/SearchInput"
import TabStyle1 from "../widgets/TabStyle1"
import { Category } from "@/types/category.type"

export type ListingFilters = Partial<{
  categories: Pick<Category, "name" | "id">[]
  price_range: [number, number]
  rating: { value: string; label: string }
}>

export type ListingFilterProps = {
  open: boolean
  filters: ListingFilters
  setFilters: (filters: ListingFilters) => void
  setOpen: (open: boolean) => void
}

const ListingFilterDialog: React.FC<ListingFilterProps> = (props) => {
  const { data: categories } = useGetCategoriesQuery("")
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState(props.filters)
  // const [priceRange, setPriceRange] = useState([0, 100000])
  const [countries, setCountries] = useState(countriesWithCode)

  useEffect(() => {
    setCountries(filter(countriesWithCode, searchText, ["name", "code"]))
  }, [searchText])

  // const { data: countries } = useGetCountriesQuery([
  //   "name",
  //   "idd",
  //   "cca2",
  //   "flag",
  //   "flags",
  // ])

  return (
    <DialogContent className="sm:max-w-4xl h-full max-h-[calc(100dvh_-_5rem)] ">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between gap-2">
          <div className="text-lg sm:text-2xl text-base-black flex items-center gap-5">
            <DialogClose>
              <X />
            </DialogClose>
            Filter Options
          </div>
          <button
            onClick={() => setFilters({})}
            className="font-medium whitespace-nowrap sm:text-lg text-primary"
          >
            Reset filter
          </button>
        </DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div className="flex max-h-[calc(100dvh_-_10rem)] overflow-auto flex-col gap-6 mt-2">
        <p className="text-lg">Sort by price range</p>
        <DualRangeSlider
          className="mb-7"
          label={(value) => `${currency.symbol}${shortNum(value ?? 0)}`}
          labelPosition="bottom"
          value={filters.price_range || [0, 10000]}
          onValueChange={(range) =>
            setFilters({
              ...filters,
              price_range: range as [number, number],
            })
          }
          min={0}
          max={50000}
          step={1}
        />

        <div className="flex flex-col gap-5 md:grid grid-cols-2">
          <div className="flex flex-col gap-6">
            <h3 className="font-medium text-lg text-neutral-900">
              Sort by location
            </h3>
            <SearchInput
              onSearch={setSearchText}
              placeholder="Search location, country, state, county"
            />
            <TabStyle1
              items={[
                { label: "All Location", active: true },
                { label: "Country" },
                { label: "State" },
                { label: "County" },
              ]}
            />
            <div className="flex flex-col gap-4 max-h-[26rem] overflow-auto">
              {countries?.map((each, i) => (
                <div
                  id={each.code}
                  key={i + "country"}
                  className="flex gap-2 pr-6 text-neutral-600 justify-between items-center"
                >
                  <span>{each.name}</span>
                  <Checkbox />
                </div>
                // <div
                //   id={each.cca2}
                //   key={i + "country"}
                //   className="flex gap-2 pr-6 text-neutral-600 justify-between items-center"
                // >
                //   <span>{each.name.common}</span>
                //   <Checkbox checked={each.cca2 == "NG" ? true : undefined} />
                // </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <h3 className="font-medium text-lg text-neutral-900">
                Sort by ratings
              </h3>
              <RadioGroup
                value={filters.rating?.value}
                onValueChange={(value) => {
                  setFilters((f) => ({
                    ...f,
                    rating: ratings.find((each) => each.value == value),
                  }))
                }}
                className="flex flex-col gap-4 max-h-[30rem] overflow-auto"
              >
                {ratings.map((each) => (
                  <div
                    key={each.value + "rating"}
                    className="flex gap-2 pr-6 text-neutral-600 justify-between items-center"
                  >
                    <span>{each.label}</span>
                    <RadioGroupItem value={each.value} />
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-medium text-lg text-neutral-900">
                Filter by categories
              </h3>
              <div className="flex flex-col gap-4 max-h-[30rem] overflow-auto">
                {categories?.map((each, i) => (
                  <div
                    key={i + "location"}
                    className="flex gap-2 pr-6 text-neutral-600 justify-between items-center"
                  >
                    <span>{each.name}</span>
                    <Checkbox
                      checked={
                        !!filters.categories?.find((cat) => cat.id == each.id)
                      }
                      onCheckedChange={(checked) => {
                        return !checked
                          ? setFilters({
                              ...filters,
                              categories: filters.categories?.filter(
                                (cat) => cat.id != each.id
                              ),
                            })
                          : setFilters({
                              ...filters,
                              categories: [
                                ...(filters.categories ?? []),
                                { id: each.id, name: each.name },
                              ],
                            })
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            onClick={() => {
              props.setFilters(filters)
              props.setOpen(false)
            }}
            className="px-10 font-normal"
            size={"lg"}
          >
            Apply filter
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

export default ListingFilterDialog
