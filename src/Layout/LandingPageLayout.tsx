// ** Styles
// ** Assets
// ** Hooks
import { Outlet } from "react-router-dom";
// ** Components
import NavBar from "../components/NavBar";

export default function LandingPageLayout() {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}
