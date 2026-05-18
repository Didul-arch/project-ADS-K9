import React from "react";
import { MapPin, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "lost":
        return "badge-lost";
      case "found":
        return "badge-found";
      case "returned":
        return "badge-returned";
      default:
        return "";
    }
  };

  return (
    <div
      className="glass card-shadow"
      style={{
        background: "white",
        overflow: "hidden",
        transition: "var(--transition)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {item.image && (
        <div
          style={{ position: "relative", height: "180px", overflow: "hidden" }}
        >
          <img
            src={item.image}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <div style={{ position: "absolute", top: "12px", left: "12px" }}>
            <span className={`badge ${getStatusClass(item.status)}`}>
              {item.status}
            </span>
          </div>
        </div>
      )}

      <div
        style={{
          padding: "20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
          }}
        >
          <Tag size={14} color="var(--ipb-blue)" />
          <span
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--ipb-blue)",
              textTransform: "uppercase",
            }}
          >
            {item.category}
          </span>
        </div>

        <h3 style={{ marginBottom: "12px" }}>{item.title}</h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MapPin size={16} color="var(--text-secondary)" />
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              {item.location}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={16} color="var(--text-secondary)" />
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              {item.date}
            </span>
          </div>
        </div>

        <Link
          to={`/detail/${item.id}`}
          className="btn btn-primary"
          style={{ marginTop: "auto", width: "100%" }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
