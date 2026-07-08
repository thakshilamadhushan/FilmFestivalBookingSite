import "./booking.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./bookingMovieCard";
import BookingForm from "./bookingForm";
import SeatMap from "./seatMap";
import BookingSummary from "./bookingSummary";

const occupiedSeats = [
  "A2",
  "A5",
  "A8",
  "B3",
  "B6",
  "B9",
  "C1",
  "C4",
  "D3",
  "E2",
  "E8",
  "F1",
  "F6",
  "G2",
  "G7",
  "H4",
];

export default function Booking() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    phone: "",
    type: "",
    time: "",
    paymentSlip: null,
  });

  const toggleSeat = (seat) => {
    if (occupiedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
      return;
    }

    if (selectedSeats.length >= 4) return;

    setSelectedSeats([...selectedSeats, seat]);
  };

  return (
    <section className="booking-page">

        <div className="backtofilms">
          {"‹ "}
          <span onClick={() => navigate("/")}>Back to Films</span>
        </div>

      <div className="booking-container">

        <div className="booking-left">

          <MovieCard />

          <BookingForm
            formData={formData}
            setFormData={setFormData}
          />

          <SeatMap
            selectedSeats={selectedSeats}
            toggleSeat={toggleSeat}
            occupiedSeats={occupiedSeats}
          />

        </div>

        <div className="booking-right">

          <BookingSummary
            formData={formData}
            seats={selectedSeats}
          />

        </div>

      </div>

    </section>
  );
}