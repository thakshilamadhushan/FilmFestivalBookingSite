import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/navbar";
import Hero from "./components/Hero/hero";
import Movies from "./components/Movies/movies";
import Footer from "./components/Footer/footer";
import BookingPage from "./components/Booking/booking";

import "./App.css";

function Home() {
  return (
    <>
      <Hero />
      <Movies />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;