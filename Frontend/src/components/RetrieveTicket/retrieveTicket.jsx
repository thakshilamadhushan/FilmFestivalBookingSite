import React, { useState } from "react";
import "./retrieveTicket.css";
import {Search,Phone,Ticket,Calendar,MapPin,Download,Eye} from "lucide-react";

const RetrieveTicket = () => {
  const [mobile, setMobile] = useState("");
  const [booking, setBooking] = useState(null);

  const handleSearch = () => {
    if (mobile === "123456") {
      setBooking({
        movie: "Veil of Silence",
        genre: "Drama / Mystery",
        date: "Jul 12, 2025",
        time: "10:00 AM",
        hall: "Hall A",
        bookingId: "FFF25-71Y817",
        seat: "H5",
        status: "CONFIRMED",
        poster:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500"
      });
    } else {
      setBooking(null);
    }
  };

  return (
    <section className="retrieve-page">

      <div className="retrieve-header">

        <div className="ticket-icon">
          <Ticket size={42} />
        </div>

        <h1>Retrieve Your Ticket</h1>

        <p>
          Enter the mobile number you used when booking.
        </p>

      </div>

      <div className="search-card">

        <label>MOBILE NUMBER</label>

        <div className="search-box">

          <div className="number-input-box">

            <Phone size={20} />

            <input
              type="text"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

          </div>

          <button className="Ticket-Search-btn" onClick={handleSearch}>
            <Search size={20} />
            Search
          </button>

        </div>

      </div>

      {!booking ? (
        <div className="empty-state">

          <Search size={55} />

          <p>Enter your mobile number to retrieve bookings</p>

        </div>
      ) : (
        <>
          <h3 className="found">
            Found <span>1</span> booking
          </h3>

          <div className="search-booking-card">

            <img src={booking.poster} alt="" className="ticket-poster"/>

            <div className="booking-info">

              <div className="ticket-top">

                <div>

                  <h2>{booking.movie}</h2>

                  <small>{booking.genre}</small>

                </div>

                <span className="ticket-status">
                  {booking.status}
                </span>

              </div>

              <div className="ticket-details">

                <p>
                  <Calendar size={16} />
                  {booking.date} · {booking.time}
                </p>

                <p>
                  <MapPin size={16} />
                  {booking.hall}
                </p>

                <strong>
                  {booking.bookingId} · Seats : {booking.seat}
                </strong>

              </div>

              <div className="ticket-buttons">

                <button>
                  <Download size={17} />
                  PDF
                </button>

                <button>
                  <Download size={17} />
                  Image
                </button>

                <button>
                  <Eye size={17} />
                  View
                </button>

              </div>

            </div>

          </div>
        </>
      )}
    </section>
  );
};

export default RetrieveTicket;