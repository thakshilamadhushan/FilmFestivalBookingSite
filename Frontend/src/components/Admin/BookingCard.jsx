import React from "react";

import {
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";

import "./BookingCard.css";

export default function BookingCard({
  booking,
  updateStatus,
  downloadPaymentSlip,
}) {
  return (
    <div className="booking-card">

      {/* Booking information */}
      <div className="booking-details">

        <div className="booking-person">

          <h3>
            {booking.name}
          </h3>

          <span>•</span>

          <p>
            {booking.studentYear}
          </p>

          <span>•</span>

          <p>
            {booking.mobileNumber}
          </p>

        </div>

        <p>
          {booking.movie?.title} ·{" "}
          {booking.date} at{" "}
          {booking.timeSlot}
        </p>

        <p>
          Seats:{" "}
          {booking.selectedSeats?.join(
            ", "
          ) || "None"}
        </p>

        <p>
          Payment Type:{" "}
          {booking.paymentType}{" "}
          | Rs.{" "}
          {booking.totalAmount}
        </p>

        <p className="booking-id">
          {booking.bookingId}
        </p>

        {booking.paymentType ===
          "Bank Payment" &&
          booking.paymentSlip && (
            <button
              className="download-slip"
              onClick={() =>
                downloadPaymentSlip(
                  booking.paymentSlip,
                  booking.bookingId
                )
              }
            >
              <Download size={15} />

              Download Slip
            </button>
          )}

      </div>

      {/* Status + buttons */}
      <div className="booking-actions">

        <span
          className={`booking-status ${booking.bookingStatus}`}
        >
          {booking.bookingStatus}
        </span>

        <div className="status-buttons">

          <button
            className="approve"
            disabled={
              booking.bookingStatus ===
              "Confirmed"
            }
            onClick={() =>
              updateStatus(
                booking._id,
                "Confirmed"
              )
            }
            title="Confirm"
          >
            <CheckCircle size={19} />
          </button>

          <button
            className="reject"
            disabled={
              booking.bookingStatus ===
              "Rejected"
            }
            onClick={() =>
              updateStatus(
                booking._id,
                "Rejected"
              )
            }
            title="Reject"
          >
            <XCircle size={19} />
          </button>

        </div>

      </div>

    </div>
  );
}