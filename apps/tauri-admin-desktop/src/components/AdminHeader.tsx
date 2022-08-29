import { useContext } from "react";
import { MdNotifications, MdSearch } from "react-icons/md";
import { AuthContext } from "api";

const AdminHeader = () => {
  const { auth } = useContext(AuthContext);
  if (!auth) return null;
  return (
    <header className="w-full h-20 bg-white shadow-md grid grid-flow-row-dense grid-cols-3 grid-rows-1 place-content-start flex-shrink-0">
      <div className="w-full col-span-2 flex items-center pl-8">
        <div className="relative group">
          <MdSearch
            size={28}
            className="absolute transform transition-all ease-in-out translate-x-1 translate-y-1 top-1 left-1 group-hover:animate-pulse"
          />
          <input
            className="w-48 px-3 pl-10 py-2 bg-transparent border-black text-black border-l border-t border-b rounded-l-md font-semibold outline-none focus:border-primary focus:w-72 transition-all ease-in-out duration-300"
            type="text"
            name="search"
            placeholder="Search"
          />
          <button className="bg-primary py-2 px-3 border border-black border-l-0 rounded-r-md font-bold text-white">
            Search
          </button>
        </div>
      </div>
      <div className="h-full w-full flex items-center justify-end space-x-4 pr-10">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <MdNotifications size={40} className="text-primary" />
          <div className="absolute top-0 right-0 mt-2 mr-1 bg-danger rounded-full p-2 w-5 h-5 text-sm flex items-center justify-center font-bold">
            2
          </div>
        </div>
        <img
          src={auth.user.PHOTO_URL}
          className="w-14 h-14 rounded-full border-primary border-4"
          alt="Profile Picture"
        />
        <div className="flex flex-col">
          <h2 className="text-lg font-bold truncate">
            {auth.user.PUBLIC_NAME}
          </h2>
          <p className="text-sm">Adminstrator</p>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
