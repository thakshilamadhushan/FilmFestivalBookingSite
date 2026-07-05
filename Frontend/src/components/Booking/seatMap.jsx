import "./seatMap.css";

const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function SeatMap({
  selectedSeats,
  occupiedSeats,
  toggleSeat,
}) {
  return (
    <div className="seat-card card">

      <h2>Select Your Seats</h2>

      <p className="seat-subtitle">
        Click seats to select. Maximum 4 seats per booking.
      </p>

      {/* Screen */}
      <div className="screen-wrapper">
        <div className="screen"></div>

        <h4>SCREEN</h4>

        <small>All eyes this way</small>
      </div>

      {/* Seats */}
      <div className="seat-layout">

        {rows.map((row) => (
          <div className="seat-row" key={row}>

            <span className="row-name">{row}</span>

            {cols.map((col) => {
              const seat = `${row}${col}`;

              const occupied = occupiedSeats.includes(seat);
              const selected = selectedSeats.includes(seat);

              return (
                <button
                  key={seat}
                  className={`seat
                  ${occupied ? "occupied" : ""}
                  ${selected ? "selected" : ""}`}
                  disabled={occupied}
                  onClick={() => toggleSeat(seat)}
                >
                  {col}
                </button>
              );
            })}

            <span className="row-name">{row}</span>

          </div>
        ))}

      </div>

      {/* Legend */}
      <div className="seat-legend">

        <div>
          <span className="legend red"></span>
          Available
        </div>

        <div>
          <span className="legend green"></span>
          Selected
        </div>

        <div>
          <span className="legend gray"></span>
          Occupied
        </div>

      </div>

    </div>
  );
}