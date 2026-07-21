import React from "react";
import * as htmlToImage from "html-to-image";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import "./bookedTicket.css";
import qr from "../../assets/QR.png";
import {FaFilm,FaCalendarAlt,FaClock,FaMapMarkerAlt,FaMobileAlt,FaChair,FaUserGraduate,FaTicketAlt} from "react-icons/fa";

const BookedTicket = () => {

    const navigate = useNavigate();
    const ticketRef = useRef();
    const captureRef = useRef(null);
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
                <span>OFFICIAL ENTRY TICKET · 2025</span>
              </div>

            </div>

            <div className="ticketbookingid">
              <small>BOOKING ID</small>
              <h3>FFF25-66W9DR</h3>
            </div>

          </div>

          {/* Body */}

          <div className="ticket-body">

            <div className="poster">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700" alt="poster" />
            </div>

            <div className="ticketdetails">

              <h1>Veil of Silence</h1>

              <h4>Drama / Mystery</h4>

              <div className="info-grid">

                <div>
                  <span>DATE</span>
                  <p><FaCalendarAlt /> Jul 13, 2025</p>
                </div>

                <div>
                  <span>TIME</span>
                  <p><FaClock /> 10:00 AM</p>
                </div>

                <div>
                  <span>HALL</span>
                  <p><FaMapMarkerAlt /> Students' Center</p>
                </div>

                <div>
                  <span>TYPE</span>
                  <p><FaFilm /> Single</p>
                </div>

                <div>
                  <span>STUDENT</span>
                  <p><FaUserGraduate /> Name</p>
                </div>

                <div>
                  <span>YEAR</span>
                  <p>Year 2</p>
                </div>

                <div>
                  <span>MOBILE</span>
                  <p><FaMobileAlt /> 69526352</p>
                </div>

                <div>
                  <span>BOOKED</span>
                  <p><FaTicketAlt /> 5 Jul 2026, 9:15 PM</p>
                </div>

              </div>

              <div className="ticketseat">

                <span>SEAT NUMBERS</span>

                <button>H2</button>
                <button>H3</button>

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

              <p>1 seat · Students' Center</p>

              <small>FFF25-66W9DR</small>

              <div className="price">
                Rs. 60.00
              </div>

            </div>

            <div className="qr">

              <img src={qr} alt="" />

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