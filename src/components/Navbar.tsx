import { NavLink } from "react-router-dom";
import "./Navbar.css"; // sicherstellen, dass dein CSS aus deiner Tabs-Sektion hier drin ist

function Navbar() {
  const tabs = [
    { name: "Home", path: "/", iconClass: "icon-home" },
    { name: "Workout", path: "/workout", iconClass: "icon-workout" },
    { name: "Übersicht", path: "/preview", iconClass: "icon-overview" },
    { name: "History", path: "/history", iconClass: "icon-history" },
    { name: "Settings", path: "/settings", iconClass: "icon-settings" },
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <NavLink
          key={tab.name}
          to={tab.path}
          className={({ isActive }) =>
            isActive ? "tab active" : "tab"
          }
        >
          <span className={`tab-icon ${tab.iconClass}`}></span>
          <span className="tab-text">{tab.name}</span>
        </NavLink>
      ))}
    </div>
  );
}

export default Navbar;