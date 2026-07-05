import "./bookingForm.css";

export default function BookingForm({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="booking-form card">

      <h2>Booking Details</h2>

      <div className="form-grid">

        {/* Full Name */}
        <div className="input-group full">
          <label>STUDENT FULL NAME</label>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Year */}
        <div className="input-group">
          <label>STUDENT YEAR</label>

          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
          >
            <option value="">Select Year</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>
        </div>

        {/* Phone */}
        <div className="input-group">
          <label>MOBILE NUMBER</label>

          <input
            type="tel"
            name="phone"
            placeholder="e.g. 07x xxx xxxx"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Type */}
        <div className="input-group">
          <label>BOOKING TYPE</label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="Single">Single</option>
            <option value="Couple">Couple</option>
          </select>
        </div>

        {/* Time */}
        <div className="input-group">
          <label>TIME SLOT</label>

          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
          >
            <option value="">Select Time</option>
            <option>09:00 AM</option>
            <option>11:30 AM</option>
            <option>02:00 PM</option>
            <option>04:30 PM</option>
            <option>07:00 PM</option>
          </select>
        </div>

      </div>

    </div>
  );
}