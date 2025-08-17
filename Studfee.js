import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://localhost/Major_api/Studfee.php";

export default function Studfee() {
  const [form, setForm] = useState({ class: "", totalfee: "" });
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false); // ✅ Search नंतर फॉर्म दाखवण्यासाठी

  // ✅ Sidebar items
  const sidebarItems = [
    { title: "Add Students", link: "/studinfo" },
    { title: "Update Students", link: "/Update" },
    { title: "Leaving Certificate", link: "/certificate" },
    { title: "Student Fees", link: "/fee" },
    { title: "Pending Fees", link: "/pendingfee" },
    { title: "Student Enrollment", link: "/enrollment" },
    { title: "Attendance", link: "/attendance" },
    { title: "Add Talukha", link: "/talukha" },
    { title: "Add City", link: "/city" },
    { title: "Dashboard", link: "/Home" },
  ];

  // ✅ Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ API Request
  const sendRequest = async (actionType) => {
    try {
      const response = await axios.post(API_URL, {
        action: actionType,
        class: form.class,
        totalfee: form.totalfee,
      });

      if (response.data.success) {
        setMessage(<div className="alert alert-success mt-2">{response.data.message}</div>);

        // ✅ Search result मिळाल्यास फॉर्ममध्ये value भरा
        if (actionType === "search" && response.data.totalfee) {
          setForm({ ...form, totalfee: response.data.totalfee });
          setShowForm(true);
        }

        // Add/Delete नंतर फॉर्म क्लिअर करा
        if (actionType === "add" || actionType === "delete") {
          setForm({ class: "", totalfee: "" });
          setShowForm(false);
        }
      } else {
        setMessage(<div className="alert alert-danger mt-2">{response.data.message}</div>);
        if (actionType === "search") setShowForm(false);
      }
    } catch (error) {
      setMessage(<div className="alert alert-danger mt-2">⚠️ Server error. Try again later.</div>);
    }
  };

  return (
    <div className="d-flex flex-wrap">
      {/* ✅ Sidebar */}
      <div
        className="sidebar bg-dark text-white p-3"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <h4 className="text-center mb-4">🎓 SPKV School</h4>
        {sidebarItems.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className="d-block text-white text-decoration-none p-2"
            style={{ transition: "background 0.3s" }}
            onMouseEnter={(e) => (e.target.style.background = "#495057")}
            onMouseLeave={(e) => (e.target.style.background = "transparent")}
          >
            {item.title}
          </a>
        ))}
      </div>

      {/* ✅ Main Content */}
      <div className="main-content flex-fill p-4 bg-light">
        <div className="container col-lg-6 col-md-8 col-sm-12 shadow p-4 bg-white rounded">
          <h3 className="text-center text-danger mb-4">Student Fee Management</h3>

          {message && <div>{message}</div>}

          {/* ✅ Search Form */}
          <div className="mb-3">
            <label htmlFor="searchClass" className="form-label">
              Enter Class to Search
            </label>
            <div className="input-group">
              <input
                type="text"
                id="searchClass"
                name="class"
                className="form-control"
                value={form.class}
                onChange={handleChange}
                placeholder="Enter Class (e.g., 5th)"
              />
              <button
                type="button"
                className="btn btn-info"
                onClick={() => sendRequest("search")}
              >
                🔍 Search
              </button>
            </div>
          </div>

          {/* ✅ Show this form only if search result found */}
          {showForm && (
            <form>
              <div className="mb-3">
                <label htmlFor="class" className="form-label">Class</label>
                <input
                  type="text"
                  className="form-control"
                  name="class"
                  id="class"
                  value={form.class}
                  onChange={handleChange}
                  readOnly // Class बदलू नये
                />
              </div>

              <div className="mb-3">
                <label htmlFor="totalfee" className="form-label">Total Fee</label>
                <input
                  type="number"
                  className="form-control"
                  name="totalfee"
                  id="totalfee"
                  value={form.totalfee}
                  onChange={handleChange}
                />
              </div>

              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-success" onClick={() => sendRequest("add")}>➕ Add</button>
                <button type="button" className="btn btn-primary" onClick={() => sendRequest("update")}>✏️ Update</button>
                <button type="button" className="btn btn-danger" onClick={() => sendRequest("delete")}>🗑️ Delete</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
