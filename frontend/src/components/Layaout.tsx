import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar/Navbar";

export const Layaout = () => {

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
