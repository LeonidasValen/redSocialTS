import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar/Navbar";

export function Layaout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>
  )
}
