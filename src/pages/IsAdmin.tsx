// ** Style
// ** Assets
// ** Hooks
// ** Components
import { useAuth } from "../context/AuthContext";
// ** Context
import AccessDenied from "./AccessDenied";
import AdminLayout from "../Layout/AdminLayout";

export default function IsAdmin() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return <AdminLayout />;
}
