import { SlLocationPin } from "react-icons/sl";
import { GoArrowRight } from "react-icons/go";
import { Link } from "react-router-dom";

export default function RecentReport() {
  const items = [
    {
      name: "Black Tumbler",
      status: "Found",
      location: "LSI",
      date: "14 Maret 2026",
      image: "https://react.dev/images/docs/scientists/Mx7dA2Y.jpg",
    },
    {
      name: "Iphone 20 Pro Mag",
      status: "Lost",
      location: "Faperta",
      date: "30 Febuari 2026",
      image: "https://react.dev/images/docs/scientists/Mx7dA2Y.jpg",
    },
    {
      name: "Tas Merah",
      status: "Lost",
      location: "FEMA",
      date: "9 Maret 2026",
      image: "https://react.dev/images/docs/scientists/Mx7dA2Y.jpg",
    },
  ];

  const getStatusColor = (status) => {
    return status === "Found" ? "bg-blue-600" : "bg-red-600";
  };

  return (
    <div className="flex gap-6">
      {items.map((item, index) => {
        return (
          <div
            key={index}
            className="w-[233px] h-[310px] rounded-lg border border-gray-300 overflow-hidden bg-white hover:shadow-lg transition-shadow"
          >
            {/* Image Container */}
            <div className="relative w-full h-[160px] bg-gray-200">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {/* Status Badge */}
              <div
                className={`absolute top-3 left-3 ${getStatusColor(
                  item.status,
                )} text-white px-3 py-1 rounded text-xs font-bold`}
              >
                {item.status.toUpperCase()}
              </div>
            </div>

            {/* Content Container */}
            <div className="p-4 flex flex-col gap-3 justify-between h-[120px]">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  {item.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-2 mb-2">
                  <SlLocationPin
                    size={16}
                    className="text-gray-500 flex-shrink-0"
                  />
                  <p className="text-sm text-gray-600">{item.location}</p>
                </div>

                {/* Date */}
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>

              {/* Button at Bottom */}
              <div className="flex justify-center">
                <Link
                  to={`/report`}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors inline-flex items-center justify-center"
                >
                  <GoArrowRight size={18} className="text-black-500" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
