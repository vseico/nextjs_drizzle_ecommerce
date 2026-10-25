"use client"

import { useState } from "react";
import { RiArrowRightDoubleFill } from "react-icons/ri";

const FilterOptions = () => {
    const [showFilter, setShowFilter] = useState(false);
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
                    <label className="flex cursor-pointer items-center gap-3">
                        <input type="checkbox" className="text-text" />
                        <span>Fresh Fruits</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                        <input type="checkbox" className="text-text" />
                        <span>Vegetables</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                        <input type="checkbox" className="text-text" />
                        <span>Cereals</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                        <input type="checkbox" className="text-text" />
                        <span>Baked Foods</span>
                    </label>
                </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-text">
                    PRICE RANGE
                </h3>
                <div className="space-y-3 text-sm text-muted">
                    <label className="flex cursor-pointer items-center gap-3">
                        <input value="0-10" type="checkbox" className="text-text" />
                        <span>$0-$10</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                        <input value="10-25"type="checkbox" className="text-text" />
                        <span>$10-$25</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                        <input value="25-50" type="checkbox" className="text-text" />
                        <span>$25-$50</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                        <input value="50+"type="checkbox" className="text-text" />
                        <span>$50+</span>
                    </label>
                </div>
            </div>
        </div>
    </aside>
  )
}

export default FilterOptions