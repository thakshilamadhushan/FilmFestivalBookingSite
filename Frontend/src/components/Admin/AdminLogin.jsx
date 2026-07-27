import { useState } from "react";
import { Lock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();
  const isComplete = /^\d{4}$/.test(pin);

  const loginAdmin = () => {
    if (pin === "2025") {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin/dashboard");
    } else {
      alert("Invalid Admin PIN");
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
              maxLength="4"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>

          <button onClick={loginAdmin} disabled={!isComplete}>
            <Shield size={18} />
            Enter Dashboard
          </button>

          <span className="back">← Back to Festival</span>
        </div>
      </div>
    </div>
  );
}
