import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Allrecord() {
  const [regNo, setRegNo] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const API_URL = "http://localhost/Major_api/Allrecord.php";

  // ✅ Sidebar Items
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

  // ✅ Search Student
  const searchStudent = async () => {
    try {
      const res = await axios.post(API_URL, {
        action: "search",
        RegisterNo: regNo,
      });
      if (res.data.error) {
        setStudent(null);
        setError(res.data.error);
      } else {
        setStudent(res.data);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching student");
    }
  };

  // ✅ Download PDF
  const downloadPDF = () => {
    window.open(`${API_URL}?download=1&RegisterNo=${regNo}`, "_blank");
  };

  return (
    <div style={{ display: "flex" }}>

      {/* ✅ Sidebar Hover साठी CSS */}
      <style>
        {`
          .sidebar-link {
            display: block;
            padding: 12px 20px;
            color: #ddd;
            text-decoration: none;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          .sidebar-link:hover {
            background-color: #495057;
            color: #fff;
            padding-left: 25px;
          }
        `}
      </style>

      {/* ✅ Sidebar */}
      <div
        style={{
          width: "220px",
          backgroundColor: "#343a40",
          height: "100vh",
          paddingTop: "20px",
          color: "white",
          position: "fixed",
        }}
      >
        <h4 className="text-center">🎓 SPKV School</h4>

        {sidebarItems.map((item, index) => (
          <Link key={index} to={item.link} className="sidebar-link">
            {item.title}
          </Link>
        ))}
      </div>

      {/* ✅ Main Content */}
      <div
        className="main"
        style={{ marginLeft: "220px", padding: "20px", width: "100%" }}
      >
        <div className="container">
          <h3 className="text-center mb-4">
            🔍 Search Student by Register Number
          </h3>
          <center>
            <div className="input-group mb-4" style={{ maxWidth: "400px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Register Number"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
              <button className="btn btn-primary" onClick={searchStudent}>
                Search
              </button>
            </div>
          </center>

          {error && <div className="alert alert-danger">{error}</div>}

          {student && (
            <div className="card p-4 shadow-sm">
              <h5 className="mb-3">🎓 Student Information</h5>
              <div className="row">
                {Object.entries(student).map(([label, value]) => (
                  <div className="mb-3 col-md-6" key={label}>
                    <label className="form-label">
                      {label.replace("_", " ")}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={value}
                      readOnly
                    />
                  </div>
                ))}
              </div>

              {/* ✅ Download PDF Button */}
              <button onClick={downloadPDF} className="btn btn-success mt-3">
                ⬇️ Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
