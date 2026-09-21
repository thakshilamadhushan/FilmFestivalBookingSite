import React from "react";
import {
  LayoutDashboard,
  TicketCheck ,
  ChevronRight,
  ChevronDown,
  Tags,
} from "lucide-react";

import "./Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "bookings",
      label: "All Bookings",
      icon: Tags,
    },
    {
      id: "validation",
      label: "Ticket Validation",
      icon: TicketCheck ,
    },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              className={`sidebar-item ${active ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={17} />

              <span>{item.label}</span>

              {active ? (
                <ChevronDown size={15} className="sidebar-arrow" />
              ) : (
                <ChevronRight size={15} className="sidebar-arrow" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
