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
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    phone: "",
    time: "",
    payment: "",
    paymentSlip: null,
    agentCode: "",
  });
  const [showPopup, setShowPopup] = useState(false);

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
          fetch(`http://localhost:5000/api/movies/${id}`),
          fetch(`http://localhost:5000/api/shows/movie/${id}`)
        ]);

        const movieData = await movieRes.json();
        const seatsData = await seatsRes.json();

        setMovie(movieData);
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
    bookingData.append("date", movie.dates[0]);
    bookingData.append("timeSlot", formData.time);
    bookingData.append("selectedSeats", JSON.stringify(selectedSeats));
    bookingData.append("paymentType", formData.payment);
    bookingData.append("totalAmount", 70 * selectedSeats.length);

    if (formData.paymentSlip) {bookingData.append("paymentSlip", formData.paymentSlip);}

    try {

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          body: bookingData
        }
      );

      const data = await response.json();

      console.log(data);

      if(data.success){
        setShowPopup(true);
      } else {
        alert(data.message || "Booking failed.");
      }

    } catch(error){
      console.log(error);
      alert("Something went wrong.");
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

          <MovieCard movie={movie}/>

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
            onBooking={handleBooking}
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

    </section>
  );
}