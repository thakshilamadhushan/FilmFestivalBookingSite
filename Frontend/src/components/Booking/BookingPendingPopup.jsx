import "./BookingPendingPopup.css";
import { FaCheckCircle } from "react-icons/fa";

export default function BookingPendingPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">

        <FaCheckCircle className="popup-icon" />

        <h2>Booking Submitted!</h2>

        <p>
          Thank you for your booking.
        </p>

        <p className="popup-message">
          Your booking is currently <strong><br></br>Pending Confirmation</strong>.
          <br /><br />
          Our team will verify your payment and send your e-ticket once the payment has been confirmed.
        </p>

        <button className="popup-btn" onClick={onClose}>
          OK
        </button>

      </div>
    </div>
  );
}