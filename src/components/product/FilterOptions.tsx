"use client"

import { categories } from "@/constants/categories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { RiArrowRightDoubleFill } from "react-icons/ri";


const priceRanges = [
   {label: "$0-$10", value: "0-10"},
   {label: "$10-$25", value: "10-25"},
   {label: "$25-50", value: "25-50"},
   {label: "$50+", value: "50+"},
] as const;

const FilterOptions = () => {
    const [showFilter, setShowFilter] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const handleFilterChange = (type: "categories" | "priceRanges", value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        const currentValues = params.getAll(type);

        params.delete(type);
        if(!currentValues.includes(value)){
            currentValues.push(value);
        }else{
            currentValues.splice(currentValues.indexOf(value),1)
        }
        currentValues.forEach((item) => {
            params.append(type, item);
        })
        router.push(`${pathname}?${params.toString()}`)
    }
    const isChecked = (type: "categories" | "priceRanges", value: string) => {
        return searchParams.getAll(type).includes(value);
    }
  return (
    <aside className="w-full sm:min-w-60 sm:max-w-60">
        {/* filter toggle button  */}
        <button onClick={() => setShowFilter((prev) => !prev)} className="mb-4 flex items-center gap-2 text-xl font-semibold text-text sm:cursor-default">
            <RiArrowRightDoubleFill className={`text-primary transition-transform duration-300 sm:hidden ${showFilter ? "rotate-90": ""}`}/>
        </button>

        {/* filters  */}
        <div className={`space-y-6 sm:block ${showFilter ? "block": "hidden"}`}>
            <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-text">
                    CATEGORIES
                </h3>
                <div className="space-y-3 text-sm text-muted">
                    {categories.map((category) => (
                        <label key={category.value} className="flex cursor-pointer items-center gap-3">
                            <input checked={isChecked("categories", category.value)} onChange={() => handleFilterChange("categories", category.value)} type="checkbox" value={"Instant Foods"} className="accent-primary" />
                            <span>{category.label}</span>
                        </label>
                    ))}
                    
                </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-text">
                    PRICE RANGE
                </h3>
                <div className="space-y-3 text-sm text-muted">
                    {priceRanges.map((range) => (
                        <label key={range.value} className="flex cursor-pointer items-center gap-3">
                        <input checked={isChecked("priceRanges", range.value)} onChange={() => handleFilterChange("priceRanges", range.value)}value="50+"type="checkbox" className="text-text" />
                        <span>{range.label}</span>
                    </label>
                    ))}
                    
                </div>
            </div>
        </div>
    </aside>
  )
}

export default FilterOptions