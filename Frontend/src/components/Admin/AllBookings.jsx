import React from "react";

import BookingCard from "./BookingCard";

import "./AllBookings.css";

export default function AllBookings({
  bookings,
  loading,
  updateStatus,
  downloadPaymentSlip,
}) {
  return (
    <div className="all-bookings">

      <div className="all-bookings-header">

        <div>
          <h2>
            All Bookings
          </h2>

          <p>
            Manage all festival bookings
          </p>
        </div>

        <span className="total-bookings">
          {bookings.length}
        </span>

      </div>

      <div className="all-bookings-list">

        {loading ? (
          <div className="empty-message">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-message">
            No bookings found.
          </div>
        ) : (
          bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              updateStatus={updateStatus}
              downloadPaymentSlip={
                downloadPaymentSlip
              }
            />
          ))
        )}

      </div>

    </div>
  );
}