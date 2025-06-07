import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export default Layout;
