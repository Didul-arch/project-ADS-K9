import { SlLocationPin } from "react-icons/sl";
import { GoArrowRight } from "react-icons/go";
import { Link } from "react-router-dom";

import CardItem from "../../../components/Common/CardItem";

export default function RecentReport() {
  const items = [
    {
      id: 1,
      name: "Black Tumbler",
      status: "Found",
      location: "LSI",
      date: "14 Maret 2026",
      image: "https://react.dev/images/docs/scientists/Mx7dA2Y.jpg",
    },
    {
      id: 2,
      name: "Iphone 20 Pro Mag",
      status: "Lost",
      location: "Faperta",
      date: "30 Febuari 2026",
      image: "https://react.dev/images/docs/scientists/Mx7dA2Y.jpg",
    },
    {
      id: 3,
      name: "Tas Merah",
      status: "Lost",
      location: "FEMA",
      date: "9 Maret 2026",
      image: "https://react.dev/images/docs/scientists/Mx7dA2Y.jpg",
    },
  ];

  return (
    <div className="flex gap-6">
      {items.map((item) => {
        return (
          <CardItem
            key={item.id}
            index={item.id}
            name={item.name}
            image={item.image}
            status={item.status}
            location={item.location}
            date={item.date}
          />
        );
      })}
    </div>
  );
}
