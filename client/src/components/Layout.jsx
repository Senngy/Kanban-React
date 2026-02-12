import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="w-full overflow-x-auto pt-4 px-4">
        <Outlet />
      </div>
    </>
  );
}
