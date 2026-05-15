import { GoArchive } from "react-icons/go";
import { RiUserUnfollowLine } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function TopCard() {
  return (
    <div className="flex gap-6">
      {/* Report Lost Item */}
      <div className="w-90.55 h-65.5 bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow ">
        <div className="flex flex-col items-start gap-4">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
            <RiUserUnfollowLine className="text-red-600" size={28} />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              Report Lost Item
            </h2>
            <p className="text-gray-600 text-sm">
              Lost something? Start here to let the community know.
            </p>
          </div>

          {/* Link */}
          <Link
            to="/report"
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors mt-2"
          >
            Get started →
          </Link>
        </div>
      </div>

      {/* Report Found Item */}
      <div className="w-90.5 h-65.5 bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow">
        <div className="flex flex-col items-start gap-4">
          {/* Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <GoArchive className="text-blue-600" size={28} />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              Report Found Item
            </h2>
            <p className="text-gray-600 text-sm">
              Found an item? Report it to find its rightful owner.
            </p>
          </div>

          {/* Link */}
          <Link
            to="/report"
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors mt-2"
          >
            Get started →
          </Link>
        </div>
      </div>
    </div>
  );
}
