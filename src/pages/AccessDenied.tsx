// ** Style
import "../styles/AccessDenied.css";
// ** Assets
// ** Hooks

export default function AccessDenied() {
  return (
    <div className="access-denied">
      <h1 className="error-code">403</h1>
      <h2 className="error-title">Access Denied</h2>
      <p className="error-message">
        You do not have permission to view this page.
      </p>
    </div>
  );
}
