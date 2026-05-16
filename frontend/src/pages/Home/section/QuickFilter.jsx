import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { GoKey, GoBriefcase } from "react-icons/go";
import { LiaLaptopSolid } from "react-icons/lia";
import { IoDocumentTextOutline, IoWalletOutline, IoCalendarOutline } from "react-icons/io5";
import { PiWatchThin } from "react-icons/pi";
import { SlLocationPin } from "react-icons/sl";


export default function QuickFilter() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const categories = [
    { id: 1, name: "Keys", count: 14, Icon: GoKey },
    { id: 2, name: "Bags", count: 28, Icon: GoBriefcase },
    { id: 3, name: "Electronics", count: 42, Icon: LiaLaptopSolid },
    { id: 4, name: "Documents", count: 19, Icon: IoDocumentTextOutline },
    { id: 5, name: "Wallets", count: 31, Icon: IoWalletOutline },
    { id: 6, name: "Accessories", count: 22, Icon: PiWatchThin },
  ];

  const locations = [
    "All Locations",
    "FAPERTA",
    "SKHB",
    "FPIK",
    "FAPET",
    "LSI",
  ];
  const dateRanges = [
    "Last 7 Days",
    "Last 30 Days",
    "Last 90 Days",
    "Last Year",
    "All Time",
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
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Location
        </h3>
        <div className="relative">
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700 flex items-center gap-2">
              <SlLocationPin/> {selectedLocation}
            </span>
            <FaChevronDown size={18} className="text-gray-400" />
          </button>
          {showLocationDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => {
                    setSelectedLocation(location);
                    setShowLocationDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                    selectedLocation === location
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DATE RANGE SECTION */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Date Range
        </h3>
        <div className="relative">
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700 flex items-center gap-2">
              <IoCalendarOutline /> {selectedDateRange}
            </span>
            <FaChevronDown size={18} className="text-gray-400" />
          </button>
          {showDateDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {dateRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setSelectedDateRange(range);
                    setShowDateDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                    selectedDateRange === range
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
