import React, { useEffect, useState } from "react";
import {
  Download,
  RefreshCcw,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();
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

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/admin/bookings/${id}/status`,
        {
          bookingStatus: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Updated booking:", response.data);

      // Update UI immediately
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id
            ? {
                ...booking,
                bookingStatus: status,
              }
            : booking,
        ),
      );

      // Refresh statistics
      const statsResponse = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error("Status update error:", error.response?.data || error);
    }
  };

  const downloadPaymentSlip = async (url, bookingId) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to download payment slip");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${bookingId}-payment-slip`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Payment slip download error:", error);
      alert("Unable to download payment slip.");
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

      <section className="admin-stats">
        <Card title="Total Bookings" value={stats.totalBookings} type="total" />
        <Card title="Pending" value={stats.pending} type="pending" />
        <Card title="Confirmed" value={stats.confirmed} />
        <Card title="Rejected" value={stats.rejected} />
        <Card title="Seats Booked" value={stats.seatsBooked} />
      </section>

      <div className="admincontent">
        <div className="adminbooking-box">
          <h2>Recent Bookings</h2>

          {bookings.map((item) => (
            <div className="adminbooking" key={item._id}>
              <div>
                <div className="nameandyearandnumber">
                  <h3>{item.name}</h3> {" • "}
                  <p>{item.studentYear}</p> {" • "}
                  <p>{item.mobileNumber}</p>
                </div>
                <p>
                  {item.movie.title} · {item.date} {"at"} {item.timeSlot}
                </p>
                <p>Seats: {item.selectedSeats.join(", ")}</p>
                <p>
                  Payment Type: {item.paymentType} {" | Rs."} {item.totalAmount}
                </p>
                <p className="bookingid">{item.bookingId}</p>
                {item.paymentType === "Bank Payment" && item.paymentSlip && (
                  <button
                    className="downloadPaymentSlip-btn"
                    onClick={() =>
                      downloadPaymentSlip(item.paymentSlip, item.bookingId)
                    }
                  >
                    <Download size={16} />
                    Download Slip
                  </button>
                )}
              </div>

              <div className="statusandbutton">
                <span className={`status ${item.bookingStatus}`}>
                  {" "}
                  {item.bookingStatus}{" "}
                </span>

                <div className="buttons">
                  {item.bookingStatus === "Pending" && (
                    <>
                      <button
                        className="approve"
                        onClick={() => updateStatus(item._id, "Confirmed")}
                      >
                        <CheckCircle />
                      </button>

                      <button
                        className="reject"
                        onClick={() => updateStatus(item._id, "Rejected")}
                      >
                        <XCircle />
                      </button>
                    </>
                  )}

                  {item.bookingStatus === "Confirmed" && (
                    <>
                      <button
                        className="approve"
                        disabled
                        onClick={() => updateStatus(item._id, "Confirmed")}
                      >
                        <CheckCircle />
                      </button>

                      <button
                        className="reject"
                        onClick={() => updateStatus(item._id, "Rejected")}
                      >
                        <XCircle />
                      </button>
                    </>
                  )}

                  {item.bookingStatus === "Rejected" && (
                    <>
                      <button
                        className="approve"
                        onClick={() => updateStatus(item._id, "Confirmed")}
                      >
                        <CheckCircle />
                      </button>

                      <button
                        className="reject"
                        disabled
                        onClick={() => updateStatus(item._id, "Rejected")}
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

            <p>
              🟢 Confirmed {stats.confirmed} / {stats.totalBookings}
            </p>

            <p>
              🟡 Pending {stats.pending} / {stats.totalBookings}
            </p>

            <p>
              🔴 Rejected {stats.rejected} / {stats.totalBookings}
            </p>
          </div>

          <div className="panel action">
            <h2>Action Required</h2>

            <p>{stats.pending} bookings awaiting review.</p>
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
