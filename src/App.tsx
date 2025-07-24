import { BrowserRouter as Router } from "react-router-dom";
import Routers from "../src/routers";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-center" autoClose={3000} />
      <Router basename="/shayyal-admin-dashboard/">
        <Routers />
      </Router>
    </AuthProvider>
  );
}
