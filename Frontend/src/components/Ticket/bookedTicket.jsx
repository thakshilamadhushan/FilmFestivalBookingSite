import React from "react";
import * as htmlToImage from "html-to-image";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import QRCode from "react-qr-code";
import "./bookedTicket.css";
import qr from "../../assets/QR.png";
import {FaFilm,FaCalendarAlt,FaClock,FaMapMarkerAlt,FaMobileAlt,FaChair,FaUserGraduate,FaTicketAlt,FaMoneyBill,FaCalendar} from "react-icons/fa";

const BookedTicket = () => {

    const navigate = useNavigate();
    const ticketRef = useRef();
    const captureRef = useRef(null);
    const location = useLocation();
    const booking = location.state;
    const downloadTicket = async () => {
      if (!ticketRef.current) return;

      try {
        const dataUrl = await htmlToImage.toPng(ticketRef.current, {
          cacheBust: true,
          pixelRatio: 3, // Higher quality
          quality: 1,
        });

        const link = document.createElement("a");
        link.download = "FIHST_Film_Ticket.png";
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <div className="ticket-page">
      <div className="success-header">
        <div className="check-icon">✔</div>
        <h1>You are all set!</h1>
        <p>Your seat is reserved. Present this ticket at the entrance.</p>
      </div>

      {/* Ticket Card */}
      <div className="ticket-wrapper">
        <div className="ticket" ref={ticketRef}>

          {/* Header */}

          <div className="ticket-header">

            <div className="ticketfestival">

              <div className="ticketlogo">
                <FaFilm />
              </div>

              <div className="ticketlogoname">
                <h2>FIHST Film Festival</h2>
                <span>OFFICIAL ENTRY TICKET · 2026</span>
              </div>

            </div>

            <div className="ticketbookingid">
              <small>BOOKING ID</small>
              <h3>{booking.bookingId}</h3>
            </div>

          </div>

          {/* Body */}

          <div className="ticket-body">

            <div className="poster">
              <img src={booking.movie.poster} alt="poster" />
            </div>

            <div className="ticketdetails">

              <h1>{booking.movie.title}</h1>

              <h4>{booking.movie.genre}</h4>

              <div className="info-grid">

                <div>
                  <span>DATE</span>
                  <p><FaCalendarAlt /> {booking.date}</p>
                </div>

                <div>
                  <span>TIME</span>
                  <p><FaClock /> {booking.timeSlot}</p>
                </div>

                <div>
                  <span>HALL</span>
                  <p><FaMapMarkerAlt /> Students' Center</p>
                </div>

                <div>
                  <span>PAYMENT</span>
                  <p><FaMoneyBill /> {booking.paymentType}</p>
                </div>

                <div>
                  <span>STUDENT</span>
                  <p><FaUserGraduate /> {booking.name}</p>
                </div>

                <div>
                  <span>YEAR</span>
                  <p><FaCalendar/>{booking.studentYear}</p>
                </div>

                <div>
                  <span>MOBILE</span>
                  <p><FaMobileAlt /> {booking.mobileNumber}</p>
                </div>

                <div>
                  <span>BOOKED</span>
                  <p><FaTicketAlt /> {booking.date}{" - "}{booking.timeSlot}</p>
                </div>

              </div>

              <div className="ticketseat">

                <span>SEAT NUMBERS</span>

                {booking.selectedSeats.map((seat, index) => (
                    <button key={index}>
                        {seat}
                    </button>
                ))}

              </div>

            </div>

          </div>

          {/* Divider */}

          <div className="divider">
            <span></span>
            <span></span>
          </div>

          {/* Footer */}

          <div className="ticket-footer">

            <div className="ticketstatus">

              <h2>● CONFIRMED</h2>

              <p>
                {booking.selectedSeats.length}{" "}
                {booking.selectedSeats.length > 1 ? "Seats" : "Seat"} · Students' Center
              </p>

              <small>{booking.bookingId}</small>

              <div className="price">
                Rs. {booking.totalAmount}.00
              </div>

            </div>

            <div className="qr">

              <div className="QRImg">
              <QRCode className="QR"
                  value={JSON.stringify({
                      bookingId: booking.bookingId,
                      name: booking.name,
                      mobile: booking.mobileNumber,
                      movie: booking.movie.title
                  })}
                  size={110}
              />
              </div>

              <span>Scan at entrance</span>

            </div>

          </div>

        </div>
      </div>

      {/* Buttons */}
      <div className="ticketactions">
        {/* <button className="pdf">Download PDF</button>*/}
        <button className="image" onClick={downloadTicket}>Download Image</button>
        <button className="another" onClick={() => navigate("/#movies")}>Book Another Film</button>
      </div>
    </div>
  );
};

export default BookedTicket;