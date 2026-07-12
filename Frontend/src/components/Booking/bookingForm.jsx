import "./bookingForm.css";

export default function BookingForm({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      paymentSlip: e.target.files[0],
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

        {/* Payment Type */}
        <div className="input-group">
          <label>PAYMENT TYPE</label>

          <select
            name="payment"
            value={formData.payment}
            onChange={handleChange}
          >
            <option value="">Select Method</option>
            <option> Bank Payment</option>
            <option> Meet Agent</option>
          </select>
        </div>
        
        {/* Show if Bank Payment is selected */}
        {formData.payment === "Bank Payment" && (
          <div className="input-group full">
            <label>Bank Accounts</label>
            <div className="BankAccounts">
              <div className="peoples">
                <p>Peopels' Bank</p>
                <p>Name: Thakshila Madhushan</p>
                <p>Acc. Number: 1234567890</p>
                <p>Branch: Yakkala</p>
              </div>
              <div className="boc">
                <p>Bank of Celon</p>
                <p>Name: Thakshila Madhushan</p>
                <p>Acc. Number: 1234567890</p>
                <p>Branch: Yakkala</p>
              </div>
            </div>
            <label>PAYMENT SLIP</label>
            <input
              type="file"
              name="paymentSlip"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
            />
            {formData.paymentSlip && (
              <small className="file-name">
                Selected: {formData.paymentSlip.name}
              </small>
            )}
          </div>
        )}

        {/* Show if Meet Agent is selected */}
        {formData.payment === "Meet Agent" && (
          <div className="input-group full">
            <label>AGENT CODE</label>
            <input
              type="text"
              name="agentCode"
              placeholder="Enter Agent Code"
              value={formData.agentCode}
              onChange={handleChange}
            />
          </div>
        )}

      </div>

    </div>
  );
}