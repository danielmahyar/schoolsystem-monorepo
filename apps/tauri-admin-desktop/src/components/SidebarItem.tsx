import React from "react";
import { IconType } from "react-icons";
import { Link, useLocation } from "react-router-dom";

const SidebarButton = ({ title, to }: { title: string; to: string }) => {
  const location = useLocation();
  const lightUp = location.pathname === to;

  return (
    <Link
      to={to}
      className={`w-full ${
        lightUp ? "bg-primary" : "bg-gray-200"
      } py-3 px-4 transition-all rounded-l-2xl opacity-100 border-none ease-in-out hover:opacity-80`}
    >
      <p className="font-bold">{title}</p>
    </Link>
  );
};
export default SidebarButton;
