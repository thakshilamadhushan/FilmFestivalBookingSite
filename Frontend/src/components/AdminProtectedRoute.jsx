import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

export default function AdminProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        setChecking(false);
        return;
      }

      try {
        await axios.get(
          "/api/admin/auth/verify",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminAuth");

        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, []);

  if (checking) {
    return <div>Checking authentication...</div>;
  }

  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/admin" replace />
  );
}