import { useState } from "react";

import { GoKey, GoBriefcase } from "react-icons/go";
import { LiaLaptopSolid } from "react-icons/lia";
import { IoDocumentTextOutline, IoWalletOutline, IoCalendarOutline } from "react-icons/io5";
import { PiWatchThin } from "react-icons/pi";

import { DateFilter, LocationFilter } from "../../../components/Common/Filter";


export default function QuickFilter() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 1, name: "Keys", count: 14, Icon: GoKey },
    { id: 2, name: "Bags", count: 28, Icon: GoBriefcase },
    { id: 3, name: "Electronics", count: 42, Icon: LiaLaptopSolid },
    { id: 4, name: "Documents", count: 19, Icon: IoDocumentTextOutline },
    { id: 5, name: "Wallets", count: 31, Icon: IoWalletOutline },
    { id: 6, name: "Accessories", count: 22, Icon: PiWatchThin },
  ];


  return (
    <div className="bg-white border-gray-300 rounded-lg shadow-sm p-6 w-87.5">
      <h2 className="text-lg font-semibold mb-6">Quick Filters</h2>

      {/* CATEGORIES SECTION */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
          Categories
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => {
            const IconComponent = category.Icon;
            return (
              <button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id,
                  )
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-2 text-gray-700">
                  <IconComponent size={28} />
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {category.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {category.count} items
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* LOCATION SECTION */}
      <LocationFilter />
      
      {/* DATE RANGE SECTION */}
      <DateFilter />
      
    </div>
  );
}
