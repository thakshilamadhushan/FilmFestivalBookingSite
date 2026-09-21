import React from "react";

import BookingCard from "./BookingCard";

import "./Overview.css";

export default function Overview({
  stats,
  bookings,
  loading,
  updateStatus,
  downloadPaymentSlip,
}) {

  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.bookingStatus === "Pending"
    );

  return (
    <div className="overview">

      {/* Statistics */}
      <section className="admin-stats">

        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
        />

        <StatCard
          title="Pending"
          value={stats.pending}
        />

        <StatCard
          title="Confirmed"
          value={stats.confirmed}
        />

        <StatCard
          title="Rejected"
          value={stats.rejected}
        />

        <StatCard
          title="Seats Booked"
          value={stats.seatsBooked}
        />

      </section>

      <div className="overview-content">

        {/* Pending */}
        <div className="pending-section">

          <div className="section-heading">

            <div>
              <h2>
                Pending Bookings
              </h2>

              <p>
                Bookings waiting for review
              </p>
            </div>

            <span className="pending-count">
              {pendingBookings.length}
            </span>

          </div>

          {loading ? (
            <div className="empty-message">
              Loading bookings...
            </div>
          ) : pendingBookings.length === 0 ? (
            <div className="empty-message">
              No pending bookings.
            </div>
          ) : (
            pendingBookings.map(
              (booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  updateStatus={
                    updateStatus
                  }
                  downloadPaymentSlip={
                    downloadPaymentSlip
                  }
                />
              )
            )
          )}

        </div>

        {/* Right side */}
        <div className="overview-side">

          <div className="panel">

            <h2>
              Status Breakdown
            </h2>

            <p>
              🟢 Confirmed{" "}
              <strong>
                {stats.confirmed}
              </strong>{" "}
              / {stats.totalBookings}
            </p>

            <p>
              🟡 Pending{" "}
              <strong>
                {stats.pending}
              </strong>{" "}
              / {stats.totalBookings}
            </p>

            <p>
              🔴 Rejected{" "}
              <strong>
                {stats.rejected}
              </strong>{" "}
              / {stats.totalBookings}
            </p>

          </div>

          <div className="panel action">

            <h2>
              Action Required
            </h2>

            <p>
              {stats.pending} booking
              {stats.pending !== 1
                ? "s"
                : ""}{" "}
              awaiting review.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
}) {
  return (
    <div className="stat-card">

      <p>{title}</p>

      <h1>
        {value ?? 0}
      </h1>

    </div>
  );
}