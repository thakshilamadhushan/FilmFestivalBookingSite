import "./booking.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    time: "",
    payment: "",
    paymentSlip: null,
    agentCode: "",
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
  const { id } = useParams();

  const [movie, setMovie] = useState(null);

  useEffect(() => {

      fetch(`http://localhost:5000/api/movies/${id}`)
          .then(res => res.json())
          .then(data => setMovie(data));

  }, [id]);

  if (!movie) {
      return <h2>Loading...</h2>;
  }


  const handleBooking = async () => {

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

    if (formData.paymentSlip) {
      bookingData.append(
        "paymentSlip",
        formData.paymentSlip
      );
    }


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
        navigate("/ticket");
      }

    } catch(error){
      console.log(error);
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

    </section>
  );
}