import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";


export default function Contactus() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost/Major_api/ContactUs.php", form, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.status === "success") {
        setResponseMsg("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setResponseMsg("❌ Failed: " + res.data.message);
      }
    } catch (error) {
      setResponseMsg("❌ Server Error. Check PHP API.");
      console.error(error);
    }
  };

  return (
    
    <div className="container my-5">
     <div className="row">
        <div className="col-lg-12">
          <img
            src="img/header.png"
            className="img-fluid"
            alt="Header"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#000000" }}>
      <div className="container">
        {/* ✅ Logo */}
        <Link className="navbar-brand fw-bold text-white" to="/">
          LOGO
        </Link>

        {/* ✅ Toggler for mobile view */}
        <button
          className="navbar-toggler text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ✅ Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/aboutus">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/contactus">Contact Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/login">Login</Link>
            </li>
          </ul>

          {/* ✅ Search Box */}
          <form className="d-flex">
            <input className="form-control me-2" type="text" placeholder="Search" />
            <button className="btn btn-warning" type="button">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
    <br/>
 {/* 🔴 Top Title */}
      <h4 className="text-center mb-3 bg-danger text-white p-3 rounded shadow">
        📩 Contact Us
      </h4>
      {/* ✅ Response Message */}
      {responseMsg && <div className="alert alert-info text-center">{responseMsg}</div>}

      <div className="row g-4">
        {/* ✅ Left Side: Contact Form */}
        <div className="col-lg-6 col-md-12">
          <div className="shadow-lg p-4 bg-white rounded-4 border">
            <h4 className="text-center text-danger mb-3 fw-bold">
              📝 Send Us a Message
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Your Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control rounded-pill p-2"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control rounded-pill p-2"
                  placeholder="example@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Message</label>
                <textarea
                  name="message"
                  className="form-control rounded-4 p-2"
                  rows="4"
                  placeholder="Write your message..."
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-danger w-100 fw-bold rounded-pill p-2"
              >
                🚀 Send Message
              </button>
            </form>
          </div>
        </div>

        {/* ✅ Right Side: Address + Map */}
        <div className="col-lg-6 col-md-12">
          <div className="shadow-lg p-4 bg-white rounded-4 border mb-4">
            <h5 className="text-center text-danger mb-3 fw-bold">🏫 School Address</h5>
            <p><strong>📌 School Name:</strong> Shree Parvati Khemchand Vidyamandir High School</p>
            <p><strong>📍 Address:</strong> Takari, Tal-Walwa, Dist-Sangli, Maharashtra - 415313</p>
            <p><strong>📞 Phone:</strong> 8275029190</p>
            <p><strong>📧 Email:</strong> shree@1960gmail.com</p>
          </div>

          {/* ✅ Google Map */}
          <div className="shadow p-2 bg-white rounded-4 border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18..."
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: "10px" }}
              allowFullScreen
              loading="lazy"
              title="map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
