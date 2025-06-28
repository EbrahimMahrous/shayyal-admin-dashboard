import { BrowserRouter as Router } from "react-router-dom";
import Routers from "../src/routers";

export default function App() {
  return (
    <Router basename="/shayyal-admin-dashboard/">
      <Routers />
    </Router>
  );
}
