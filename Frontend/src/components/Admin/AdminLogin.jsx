import { useState } from "react";
import { Lock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isComplete = /^\d{4}$/.test(pin);

  const loginAdmin = async () => {
    if (!isComplete || loading) return;

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:5000/api/admin/auth/login", {
        pin,
      });

      const { token } = response.data;

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminAuth", "true");

      navigate("/admin/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-box">
        <div className="login-icon">
          <Lock />
        </div>

        <h1>Admin Access</h1>

        <p>Enter your admin PIN to continue</p>

        <div className="pin-card">
          <label>ADMIN PIN</label>

          <div className="input-box">
            <Lock size={18} />

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  loginAdmin();
                }
              }}
            />
          </div>

          <button onClick={loginAdmin} disabled={!isComplete || loading}>
            <Shield size={18} />

            {loading ? "Authenticating..." : "Enter Dashboard"}
          </button>

          <span className="back" onClick={() => navigate("/")}>
            ← Back to Festival
          </span>
        </div>
      </div>
    </div>
  );
}
