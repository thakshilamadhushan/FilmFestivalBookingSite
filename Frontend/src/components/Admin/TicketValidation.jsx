import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  CheckCircle,
  XCircle,
  Camera,
  Search,
  Ticket,
  User,
  Phone,
  Film,
  Armchair,
  RefreshCw,
} from "lucide-react";
import "./TicketValidation.css";

export default function ValidateTicket() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");
  const scannerRef = useRef(null);

  const [scanner, setScanner] = useState(null);
  const [scanning, setScanning] = useState(false);

  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState(null);

  const [alreadyValidated, setAlreadyValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // Start QR Scanner
  // --------------------------------------------------

  const startScanner = async () => {
    setError("");
    setSuccess("");

    if (scanning) return;

    try {
      const qrScanner = new Html5Qrcode("ticket-qr-reader");

      await qrScanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          console.log("QR:", decodedText);

          await stopScanner(qrScanner);

          await handleQRCode(decodedText);
        },
        () => {
          // Ignore QR scan errors while scanning
        },
      );

      scannerRef.current = qrScanner;
      setScanner(qrScanner);
      setScanning(true);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to access camera. Please allow camera permission and try again.",
      );
    }
  };

  // --------------------------------------------------
  // Stop Scanner
  // --------------------------------------------------

  const stopScanner = async (scannerInstance = scannerRef.current) => {
    if (!scannerInstance) return;

    try {
      await scannerInstance.stop();
      await scannerInstance.clear();
    } catch (err) {
      console.log("Scanner stop:", err);
    }

    scannerRef.current = null;
    setScanner(null);
    setScanning(false);
  };

  // --------------------------------------------------
  // Parse QR
  // --------------------------------------------------

  const handleQRCode = async (qrText) => {
    try {
      // console.log("Raw QR text:", qrText);

      let qrData;

      try {
        qrData = JSON.parse(qrText);
      } catch (parseError) {
        // QR contains only the booking ID
        qrData = {
          bookingId: qrText.trim(),
        };
      }

      // console.log("Parsed QR data:", qrData);

      if (!qrData?.bookingId) {
        setError("Invalid QR code. Booking ID is missing.");
        return;
      }

      // Show scanned booking ID in input
      setBookingId(qrData.bookingId);

      // IMPORTANT:
      // Send QR data directly to validation
      await validateBooking(qrData);
    } catch (err) {
      // console.error("QR validation error:", err);

      setError(err.message || "Unable to validate QR ticket.");
    }
  };

  // --------------------------------------------------
  // Validate Booking
  // --------------------------------------------------

  const validateBooking = async (qrData = null) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setBooking(null);
      setAlreadyValidated(false);

      let dataToSend;

      // ==========================================
      // QR CODE VALIDATION
      // ==========================================
      if (qrData !== null) {
        // console.log("Validating QR data:", qrData);

        if (!qrData.bookingId) {
          throw new Error("Invalid QR code. Booking ID is missing.");
        }

        dataToSend = {
          bookingId: String(qrData.bookingId).trim(),
          name: qrData.name || "",
          mobileNumber: qrData.mobile || "",
          movie: qrData.movie || "",
        };
      }

      // ==========================================
      // MANUAL BOOKING ID VALIDATION
      // ==========================================
      else {
        const cleanId = bookingId.trim();

        if (!cleanId) {
          throw new Error("Please enter a booking ID.");
        }

        dataToSend = {
          bookingId: cleanId,
        };
      }

      // console.log("Sending validation request:", dataToSend);

      const response = await fetch(`${API_URL}/api/admin/bookings/validate`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      // console.log("Validation response:", data);

      if (response.status === 409) {
        setBooking(data.booking || null);
        setAlreadyValidated(true);
        setError(data.message || "This ticket has already been validated.");
        setSuccess("");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Booking validation failed.");
      }

      if (!data.booking) {
        throw new Error("Booking data was not returned by the server.");
      }

      setAlreadyValidated(false);
      setBooking(data.booking);
      setSuccess(data.message || "Ticket verified successfully.");
    } catch (err) {
      // console.error("Validation error:", err);

      setError(err.message || "Ticket validation failed.");

      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------

  const resetValidator = async () => {
    await stopScanner();

    setBooking(null);
    setBookingId("");
    setError("");
    setSuccess("");
    setAlreadyValidated(false);
  };

  // --------------------------------------------------
  // Cleanup
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .finally(() => {
            scannerRef.current?.clear().catch(() => {});
          });
      }
    };
  }, []);

  return (
    <div className="validate-ticket-page">
      <div className="validate-ticket-container">
        {/* Header */}
        <div className="validate-header">
          <div>
            <span className="validate-label">ADMIN PANEL</span>
            <h1>Ticket Validation</h1>
            <p>
              Scan a festival ticket QR code to verify the booking and seats.
            </p>
          </div>

          <Ticket size={42} />
        </div>

        <div className="validate-grid">
          {/* LEFT SIDE */}
          <div className="scanner-card">
            <div className="card-title">
              <Camera size={21} />
              <h2>Scan Ticket QR</h2>
            </div>

            <div id="ticket-qr-reader" className="ticket-qr-reader" />

            {!scanning ? (
              <button className="scan-button" onClick={startScanner}>
                <Camera size={19} />
                Scan Ticket
              </button>
            ) : (
              <button className="stop-button" onClick={() => stopScanner()}>
                Stop Scanner
              </button>
            )}

            <div className="scanner-divider">
              <span>OR</span>
            </div>

            {/* Manual Booking ID */}
            <div className="manual-validation">
              <label>Booking ID</label>

              <div className="booking-input">
                <input
                  type="text"
                  placeholder="FFF******"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      validateBooking();
                    }
                  }}
                />

                <button onClick={() => validateBooking()} disabled={loading}>
                  <Search size={18} />
                </button>
              </div>
            </div>

            {booking || error ? (
              <button className="reset-button" onClick={resetValidator}>
                <RefreshCw size={17} />
                Scan Another Ticket
              </button>
            ) : null}
          </div>

          {/* RIGHT SIDE */}
          <div className="result-card">
            {!booking && !error && !loading && (
              <div className="empty-validation">
                <Ticket size={55} />
                <h2>No Ticket Selected</h2>
                <p>
                  Scan a QR code or enter a booking ID to validate a ticket.
                </p>
              </div>
            )}

            {loading && (
              <div className="empty-validation">
                <RefreshCw className="loading-icon" size={45} />
                <h2>Validating Ticket...</h2>
                <p>Please wait.</p>
              </div>
            )}

            {error && !loading && !alreadyValidated && (
              <div className="invalid-ticket">
                <XCircle size={60} />

                <h2>Invalid Ticket</h2>

                <p>{error}</p>

                {bookingId && (
                  <span className="invalid-booking-id">{bookingId}</span>
                )}
              </div>
            )}

            {booking && !loading && (
              <div className="ticket-result">
                {/* Valid */}
                <div
                  className={
                    alreadyValidated
                      ? "already-validated-ticket"
                      : "valid-ticket"
                  }
                >
                  {alreadyValidated ? (
                    <XCircle size={27} />
                  ) : (
                    <CheckCircle size={27} />
                  )}

                  <div>
                    <strong>
                      {alreadyValidated
                        ? "Ticket Already Used"
                        : "Ticket Valid"}
                    </strong>
                    <span>
                      {alreadyValidated
                        ? "This ticket has already been validated."
                        : success}
                    </span>
                  </div>
                </div>

                {/* Booking ID */}
                <div className="verified-id">
                  <span>BOOKING ID</span>
                  <strong>{booking.bookingId}</strong>
                </div>

                {/* Details */}
                <div className="booking-details">
                  <div className="detail-item">
                    <User size={19} />

                    <div>
                      <span>Name</span>
                      <strong>{booking.name}</strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <Phone size={19} />

                    <div>
                      <span>Mobile</span>
                      <strong>{booking.mobile}</strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <Film size={19} />

                    <div>
                      <span>Movie</span>
                      <strong>{booking.movie}</strong>
                    </div>
                  </div>
                </div>

                {/* Seats */}
                <div className="seats-section">
                  <div className="seats-header">
                    <div>
                      <Armchair size={21} />
                      <h3>Selected Seats</h3>
                    </div>

                    <span>{booking.seats?.length || 0} Seats</span>
                  </div>

                  <div className="seat-layout">
                    {booking.seats?.map((seat) => (
                      <div key={seat} className="seat selected">
                        {seat}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="seat-legend">
                    <div>
                      <span className="legend-seat selected" />
                      <span>Selected</span>
                    </div>

                    <div>
                      <span className="legend-seat vacant" />
                      <span>Available</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
