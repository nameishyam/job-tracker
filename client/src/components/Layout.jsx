import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";

const Layout = () => (
  <div className="min-h-screen bg-primary">
    <Navbar />
    <main className="main-content">
      <Outlet />
    </main>
  </div>
);

export default Layout;
