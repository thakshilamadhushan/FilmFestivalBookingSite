import React, { useState } from "react";
import axios from "axios";
import "./retrieveTicket.css";
import {Search,Phone,Ticket,Calendar,MapPin,Download,Eye} from "lucide-react";

const RetrieveTicket = () => {
  const [mobile, setMobile] = useState("");
  const [bookings, setBookings] = useState([]);

  const handleSearch = async () => {

        try {

            const res = await axios.get(
                `http://localhost:5000/api/bookings/ticket/${mobile}`
            );


            setBookings(res.data.bookings);


        } catch(error) {

            console.log(error);

            alert("Ticket not found");

            setBookings([]);

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

      {bookings.length === 0 ? (
        <div className="empty-state">

          <Search size={55} />

          <p>Enter your mobile number to retrieve bookings</p>

        </div>
      ) : (
        <>
          <h3 className="found">
            Found <span>{bookings.length}</span> booking
          </h3>

          {bookings.map((booking)=> (

          <div className="search-booking-card">

            <img src={booking.movie.poster} alt="" className="ticket-poster"/>

            <div className="booking-info">

              <div className="ticket-top">

                <div>

                  <h2>{booking.movie.title}</h2>

                  <small>{booking.movie.genre}</small>

                </div>

                <span className={`ticket-status ${booking.bookingStatus.toLowerCase()}`}>
                  {booking.bookingStatus}
                </span>

              </div>

              <div className="ticket-details">

                <p>
                  <Calendar size={16} />
                  {booking.date} · {booking.timeSlot}
                </p>

                <p>
                  <MapPin size={16} />
                  Students' Center
                </p>

                <div className="ticket-buttons">
                  <strong>
                    {booking.bookingId} · Seats : {booking.selectedSeats.map((seat,index)=>( <span key={index}> {seat} </span>))}
                  </strong>

                  <button>
                    <Eye size={17} />
                    View
                  </button>
              </div>

              </div>
            </div>

          </div>
          ))}
        </>
      )}
    </section>
  );
};

export default RetrieveTicket;