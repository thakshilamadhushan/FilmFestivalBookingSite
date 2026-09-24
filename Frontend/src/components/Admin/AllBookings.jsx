import React, { useState } from "react";
import { Download, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard({
  bookings = [],
  setBookings,
  setStats,
}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const currentBookings = bookings.slice(
    startIndex,
    startIndex + bookingsPerPage,
  );

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
    <div className="admin-overview">

      <div className="adminbooking-box">
          <h2>All Bookings</h2>

          {currentBookings.map((item) => (
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
      <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`page-number ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
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
