import { BrowserRouter as Router } from "react-router-dom";
import Routers from "../src/routers";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router basename="/shayyal-admin-dashboard/">
        <Routers />
      </Router>
    </AuthProvider>
  );
}
