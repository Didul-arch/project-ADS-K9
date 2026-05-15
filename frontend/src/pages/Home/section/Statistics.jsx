import {
  GoListUnordered,
  GoCheckCircleFill,
  GoShieldCheck,
  GoChecklist,
} from "react-icons/go";

export default function Statistics() {
  const stats = [
    {
      title: "Total Lost Items",
      value: "1,284",
      icon: GoListUnordered,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Found Items",
      value: "856",
      icon: GoCheckCircleFill,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Returned Items",
      value: "432",
      icon: GoShieldCheck,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Pending Claims",
      value: "12",
      icon: GoChecklist,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
    },
  ];

  return (
    <div className="flex gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`w-[175px] h-[180px] ${stat.bgColor} rounded-lg border border-gray-200 p-4 flex flex-col justify-between`}
          >
            {/* Top Section - Icon & Title */}
            <div className="flex flex-col gap-3">
              <Icon className={`${stat.iconColor} text-2xl`} />
              <p className="text-2xl text-gray-600">{stat.title}</p>
            </div>

            {/* Bottom Section - Value */}
            <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
