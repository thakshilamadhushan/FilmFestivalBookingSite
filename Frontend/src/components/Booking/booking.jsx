import "./booking.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MovieCard from "./bookingMovieCard";
import BookingForm from "./bookingForm";
import SeatMap from "./seatMap";
import BookingSummary from "./bookingSummary";
import BookingPendingPopup from "./BookingPendingPopup";

export default function Booking() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    phone: "",
    date: "",
    time: "",
    payment: "",
    paymentSlip: null,
    agentCode: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: "",
    message: "",
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

  // get movie details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, seatsRes] = await Promise.all([
          fetch(`${API_URL}/api/movies/${id}`),
          fetch(`${API_URL}/api/shows/movie/${id}`),
        ]);

        const movieData = await movieRes.json();
        const seatsData = await seatsRes.json();

        setMovie(movieData.movie);
        setOccupiedSeats(seatsData.seats || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!movie) {
    return <h2>Loading...</h2>;
  }

  const handleBooking = async () => {
    // Validation
    if (!formData.name) {
      alert("Please enter your name.");
      return;
    }

    if (!formData.year) {
      alert("Please select your year.");
      return;
    }

    if (!formData.phone) {
      alert("Please enter your mobile number.");
      return;
    }

    if (!formData.date) {
      alert("Please select a date.");
      return;
    }

    if (!formData.time) {
      alert("Please select a time slot.");
      return;
    }

    if (!formData.payment) {
      alert("Please select a payment method.");
      return;
    }

    if (formData.payment === "Bank Transfer" && !formData.paymentSlip) {
      alert("Please upload your payment slip.");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const bookingData = new FormData();

    bookingData.append("movie", id);
    bookingData.append("name", formData.name);
    bookingData.append("studentYear", formData.year);
    bookingData.append("mobileNumber", formData.phone);
    bookingData.append("date", formData.date);
    bookingData.append("timeSlot", formData.time);
    bookingData.append("selectedSeats", JSON.stringify(selectedSeats));
    bookingData.append("paymentType", formData.payment);
    bookingData.append("totalAmount", 70 * selectedSeats.length);

    if (formData.paymentSlip) {
      bookingData.append("paymentSlip", formData.paymentSlip);
    }

    if (formData.agentCode) {
      bookingData.append("agentCode", formData.agentCode);
    }

    try {
      setBookingLoading(true);

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        body: bookingData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Successful booking
        setShowPopup(true);
      } else {
        // Backend error
        setPopup({
          show: true,
          type: "error",
          message: data.message || "Booking failed.",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);

      setPopup({
        show: true,
        type: "error",
        message: "Unable to connect to the server.",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className="booking-page">
      <div className="backtofilms">
        {"‹ "}
        <span onClick={() => navigate("/")}>Back to Films</span>
      </div>

      <div className="booking-container">
        <div className="booking-left">
          <MovieCard movie={movie} />

          <BookingForm
            formData={formData}
            setFormData={setFormData}
            times={movie.times}
            dates={movie.dates}
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
            onBooking={handleBooking}
            loading={bookingLoading}
          />
        </div>
      </div>
      <BookingPendingPopup
        isOpen={showPopup}
        onClose={() => {
          setShowPopup(false);
          navigate("/");
        }}
      />

      {popup.show && (
        <div className="popup-overlay">
          <div className={`popup-box ${popup.type}`}>
            <button
              className="popup-close"
              onClick={() =>
                setPopup({
                  show: false,
                  type: "",
                  message: "",
                })
              }
            >
              ×
            </button>

            <div className="popup-icon">!</div>

            <h3>Booking Error</h3>

            <p>{popup.message}</p>

            <button
              className="popup-ok"
              onClick={() =>
                setPopup({
                  show: false,
                  type: "",
                  message: "",
                })
              }
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
