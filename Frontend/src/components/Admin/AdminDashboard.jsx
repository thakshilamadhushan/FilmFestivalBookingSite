import {
  RefreshCcw,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { useState } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: "Siddharth T",
      movie: "Crimson Hour",
      status: "Confirmed",
      seats: 2,
    },

    {
      id: 2,
      name: "Kavitha Rao",
      movie: "Veil Of Silence",
      status: "Pending",
      seats: 3,
    },

    {
      id: 3,
      name: "Varun Nair",
      movie: "One Last Dawn",
      status: "Confirmed",
      seats: 1,
    },

    {
      id: 4,
      name: "Priya Patel",
      movie: "The Last Frame",
      status: "Pending",
      seats: 2,
    },
  ]);

  const updateStatus = (id, status) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const logout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin");
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

      <section className="admin-stats">
        <Card title="Total Bookings" value={12} />
        <Card title="Pending" value={5} />
        <Card title="Confirmed" value={5} />
        <Card title="Rejected" value={2} />
        <Card title="Seats Booked" value={23} />
      </section>

      <div className="admincontent">
        <div className="adminbooking-box">
          <h2>Recent Bookings</h2>

          {bookings.map((item) => (
            <div className="adminbooking" key={item.id}>
              <div>
                <h3>{item.name}</h3>
                <p>{item.movie} · Jul 14, 2025</p>
                <p className="bookingid">FFF25-SEED12</p>
              </div>

              <div className="statusandbutton">
                <span className={`status ${item.status}`}> {item.status} </span>

                <div className="buttons">
                  {item.status === "Pending" && (
                    <>
                      <button
                        className="approve"
                        onClick={() => updateStatus(item.id, "Confirmed")}
                      >
                        <CheckCircle />
                      </button>

                      <button
                        className="reject"
                        onClick={() => updateStatus(item.id, "Rejected")}
                      >
                        <XCircle />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="side">
          <div className="panel">
            <h2>Status Breakdown</h2>

            <p>🟢 Confirmed 5 / 12</p>

            <p>🟡 Pending 5 / 12</p>

            <p>🔴 Rejected 2 / 12</p>
          </div>

          <div className="panel action">
            <h2>Action Required</h2>

            <p>5 bookings awaiting review.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="stat-card">
      <p>{title}</p>

      <h1>{value}</h1>
    </div>
  );
}
