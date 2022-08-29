import { MdCreate, MdDashboard, MdHome } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo_only.png";
import SidebarButton from "./SidebarItem";

const MainSidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className=" w-60 h-full bg-dark flex-shrink-0">
      <div className="h-56 flex flex-col items-center justify-center">
        <img
          src={logo}
          onClick={() => navigate("/")}
          alt="School logo"
          className="w-36 h-36 cursor-pointer"
        />
        <h1 className="text-white text-2xl font-bold">Administration</h1>
      </div>
      <ul className="flex flex-col space-y-4 bg-transparent p-4">
        <Link
          to="/"
          className="border-white border text-white flex space-x-2 items-center justify-start font-bold px-4 py-2 rounded-lg transition-all ease-in-out duration-200 hover:bg-white hover:text-black focus:bg-white focus:text-black"
        >
          <MdDashboard size={25} />
          <p>Dashboard</p>
        </Link>
        <Link
          to="/create-student"
          className="border-white border text-white flex space-x-2 items-center justify-start font-bold px-4 py-2 rounded-lg transition-all ease-in-out duration-200 hover:bg-white hover:text-black"
        >
          <MdCreate size={25} />
          <p>Create student</p>
        </Link>
      </ul>
    </aside>
  );
};

export default MainSidebar;
