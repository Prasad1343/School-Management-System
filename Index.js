import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="bg-light fw-bold">
      {/* 🔴 Header Image */}
      <img
            src="img/header.png"
            className="img-fluid"
            alt="Header"
            style={{ width: "100%", height: "100%" }}
          />
<br/>

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
      

      {/* 🔴 Main Layout */}
      <div className="container-fluid mt-4">
        <div className="row g-3">
          
          {/* ✅ Left Column */}
          <div className="col-lg-3 col-md-6 col-12">
            <Box title="संपर्क">
              {[
                ["ताकारी पोलीस स्टेशन", "02342222033"],
                ["प्राथमिक आरोग्य केंद्र ताकारी", "7387296819"],
                ["ताकारी बस स्थानक", "9604332665"],
                ["सौ.अल्पना धनंजय थोरात (मुख्याध्यापिका)", "8275029190"],
                ["सौ. भाग्यश्री तावरे (पर्यवेक्षक)", "9405363462"],
                ["श्री. विक्रमसिंह पाटील (सहाय्यक शिक्षक)", "8087240185"],
                ["श्री. अमोल रविंद्र बोगार (हेड क्लार्क)", "9970087981"],
              ].map(([name, phone], i) => (
                <div key={i} className="list-group-item border mb-2">
                  <img src="images/arrow.png" alt="" width={18} className="me-2" />
                  {name}
                  <br />
                  <img src="images/phone.png" alt="" width={18} className="me-2" />
                  {phone}
                </div>
              ))}
            </Box>
          </div>

          {/* ✅ Center Column */}
          <div className="col-lg-6 col-md-12 col-12">
            <Box title="गुरुदेव रविंद्रनाथ टागोर शिक्षण संस्था, ताकारी">
              <p className="text-justify">
                पार्वती खेमचंद विद्यामंदिर, ताकारीचे माजी मुख्याध्यापक स्व.
                मारूती आण्णा पाटील (आप्पा) यांच्या प्रथम पुण्यस्मरण दिनानिमित्त...
              </p>
            </Box>

            <Box title="शाळेची संयुक्तीक माहिती">
              <table className="table table-striped table-bordered">
                <tbody>
                  {[
                    ["संस्थेचे नाव", "गुरूदेव खींद्रनाथ टागोर शिक्षण संस्था"],
                    ["शाळेचे नाव", "श्री पार्वती खेमचंद माध्यमिक व उच्च माध्यमिक विद्यामंदिर"],
                    ["स्थापना", "3 फेब्रुवारी 1960"],
                    ["ग्रंथालय", "01"],
                    ["संगणक कक्ष", "01"],
                    ["क्रिडांगण", "01"],
                    ["विदयार्थी", "-"],
                    ["वर्ग", "-"],
                  ].map(([label, value], i) => (
                    <tr key={i}>
                      <td>{label}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </div>

          {/* ✅ Right Column */}
          <div className="col-lg-3 col-md-6 col-12">
            <Box title="शिक्षणाचे घोषवाक्य">
              <marquee direction="up" scrollAmount="2" height="200">
                <ul className="list-unstyled">
                  <li>1] शिक्षण, म्हणजे भविष्याची हमी</li>
                  <li>2] वाचन करा ,विद्वान बना</li>
                  <li>3] विद्या सामर्थ्य देते</li>
                  <li>4] जीवनाचे सौंदर्य म्हणजे शिक्षण</li>
                  <li>5] ज्ञान म्हणजेच विकास</li>
                </ul>
              </marquee>
            </Box>

            <Box title="शाळा म्हणजे काय">
              <p className="text-justify">
                शाळा ही सर्वांगीण विकासाचे माध्यम आहे. इथे बौद्धिक, सामाजिक,
                मानसिक, शारीरिक व नैतिक विकास होतो.
              </p>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ Reusable Box Component – Maroon Header */
function Box({ title, children }) {
  return (
    <div className="shadow p-3 mb-4 bg-white rounded">
      <h5
        className="text-white text-center p-2 rounded"
        style={{ backgroundColor: "#862d2d" }}
      >
        {title}
      </h5>
      {children}
    </div>
  );
}
