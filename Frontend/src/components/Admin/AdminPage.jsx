import React, { useEffect, useState } from "react";
import axios from "axios";
import { LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import Overview from "./AdminDashboard";
import { useNavigate } from "react-router-dom";
import TicketValidation from "./TicketValidation";
import "./AdminPage.css";

const AdminDashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
    seatsBooked: 0,
  });

  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [bookingsResponse, statsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/admin/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${API_URL}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setBookings(bookingsResponse.data.bookings);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <header>
        <div>
          <h1>🛡 Admin Dashboard</h1>
          <p>Faculty Film Festival 2026 · Booking Management</p>
        </div>

        <div className="admin-actions">
          <button onClick={logout} className="exit">
            <LogOut size={16} />
            Exit Admin
          </button>
        </div>
      </header>
      <main className="dashboard-container">
        <div className="dashboard-layout">
          {/* LEFT */}
          <div className="dashboard-left">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* RIGHT */}
          <div className="dashboard-content">
            {activeTab === "overview" && (
              <div className="placeholder-page">
                <Overview bookings={bookings} stats={stats} setBookings={setBookings} setStats={setStats} />
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="placeholder-page">
                <h1>All Bookings</h1>
              </div>
            )}

            {activeTab === "validation" && (
              <div className="placeholder-page">
                <TicketValidation/>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
