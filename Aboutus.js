import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function Aboutus() {
  return (
    <div style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#f8f9fa" }}>
      {/* 🔴 Header Image */}
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

      {/* 🔴 Navbar */}
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

      {/* 🔴 Main Content */}
      <div className="container my-5">
        {/* Section Title */}
        <div
          className="section-title"
          style={{
            backgroundColor: "#862d2d",
            color: "white",
            padding: "10px",
            borderRadius: "6px",
            textAlign: "center",
            fontSize: "22px",
            marginBottom: "20px",
          }}
        >
          आमच्याविषयी
        </div>

        {/* School Logo & Name */}
        <div className="text-center mb-4">
          <h3 className="mt-2" style={{ color: "#862d2d", fontWeight: "bold" }}>
            गुरुदेव रविंद्रनाथ टागोर शिक्षण संस्था, ताकारी
          </h3>
        </div>

        {/* परिचय */}
        <div className="row align-items-center">
          <div className="col-md-6 mb-4">
            <img
              src="img/17.jpg"
              alt="शाळा इमारत"
              style={{
                width: "80%",
                height: "50%",
                borderRadius: "10px",
                boxShadow: "0 0 8px rgba(0,0,0,0.2)",
              }}
            />
          </div>
          <div className="col-md-6">
            <p className="fs-5 text-justify">
              गुरुदेव रविंद्रनाथ टागोर शिक्षण संस्था, ताकारी ही संस्थेची स्थापना
              गुणवत्तापूर्ण शिक्षण आणि विद्यार्थ्यांच्या सर्वांगीण विकासासाठी
              करण्यात आली आहे. येथे मुलांचे शैक्षणिक, सामाजिक, नैतिक आणि भावनिक
              विकास यावर विशेष भर दिला जातो.
            </p>
          </div>
        </div>

        {/* Vision / Mission / Values */}
        <div className="row text-center mt-5">
          {[
            {
              title: "🔭 दृष्टिकोन (Vision)",
              text: "विद्यार्थ्यांना उत्कृष्ट शिक्षण व मूल्यांची जाण देणे, जेणेकरून ते जबाबदार नागरिक बनतील.",
            },
            {
              title: "🎯 ध्येय (Mission)",
              text: "गुणवत्तापूर्ण शिक्षण, नवोपक्रमशील पद्धती व विद्यार्थी-केंद्रित उपक्रमांचा अवलंब करणे.",
            },
            {
              title: "💡 मूल्य (Values)",
              text: "प्रामाणिकपणा, सहकार्य, कष्टाची तयारी, आणि सामाजिक जाणीव.",
            },
          ].map((item, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <div className="card h-100 shadow">
                <div className="card-body">
                  <h5 style={{ color: "#862d2d", fontWeight: "bold" }}>{item.title}</h5>
                  <p>{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
