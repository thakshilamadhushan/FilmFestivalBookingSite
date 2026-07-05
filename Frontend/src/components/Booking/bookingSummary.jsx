import "./bookingSummary.css";
import {
  FaUser,
  FaPhoneAlt,
  FaCalendarAlt,
  FaClock,
  FaChair,
} from "react-icons/fa";

export default function BookingSummary({ formData, seats }) {
  const isComplete =
    formData.name &&
    formData.year &&
    formData.phone &&
    formData.type &&
    formData.time &&
    seats.length > 0;

  return (
    <div className="summary-card card">

      <h2>Booking Summary</h2>

      <div className="summary-info">

        <div className="summary-item">
          <FaUser />
          <div>
            <small>Name</small>
            <p>{formData.name || "--"}</p>
          </div>
        </div>

        <div className="summary-item">
          <FaCalendarAlt />
          <div>
            <small>Student Year</small>
            <p>{formData.year || "--"}</p>
          </div>
        </div>

        <div className="summary-item">
          <FaPhoneAlt />
          <div>
            <small>Phone</small>
            <p>{formData.phone || "--"}</p>
          </div>
        </div>

        <div className="summary-item">
          <FaChair />
          <div>
            <small>Booking Type</small>
            <p>{formData.type || "--"}</p>
          </div>
        </div>

        <div className="summary-item">
          <FaClock />
          <div>
            <small>Time Slot</small>
            <p>{formData.time || "--"}</p>
          </div>
        </div>

      </div>

      <div className="divider"></div>

      <h3>Selected Seats</h3>

      {seats.length === 0 ? (
        <p className="empty-seat">
          No seats selected
        </p>
      ) : (
        <div className="seat-list">
          {seats.map((seat) => (
            <span key={seat}>{seat}</span>
          ))}
        </div>
      )}

      <div className="divider"></div>

      <div className="price-row">
        <span>Total Seats</span>
        <strong>{seats.length}</strong>
      </div>

      <div className="price-row">
        <span>Booking Fee</span>
        <strong>FREE</strong>
      </div>

      <button
        className="confirm-btn"
        disabled={!isComplete}
      >
        Confirm Booking
      </button>

    </div>
  );
}