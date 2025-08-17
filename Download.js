import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Download() {
  const [regno, setRegno] = useState("");
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");

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

  // ✅ Search Function
  const handleSearch = async () => {
    setMessage("Searching...");
    setStudent(null);

    try {
      const response = await fetch("http://localhost/Major_api/Download.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regno }),
      });
      const data = await response.json();

      if (data.success) {
        setStudent(data.student);
        setMessage("");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server Error!");
    }
  };

  // ✅ PDF Download
  const handleDownload = () => {
    window.open(`http://localhost/Major_api/Download.php?regno=${regno}`, "_blank");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ✅ Sidebar */}
      <div
        className="sidebar"
        style={{
          width: "230px",
          backgroundColor: "#343a40",
          padding: "20px",
          color: "#fff",
          position: "fixed",
          height: "100%",
        }}
      >
        <h4 style={{ color: "#ffc107", marginBottom: "20px" }}>🎓 SPKV School</h4>

        {/* 🔽 Dynamic Sidebar Items */}
        {sidebarItems.map((item, index) => (
          <a
            key={index}
            href={item.link}
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#495057")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            {item.title}
          </a>
        ))}
      </div>

      {/* ✅ Main Content */}
      <div style={{ marginLeft: "250px", padding: "30px", width: "100%" }}>
        <h2 className="text-center text-primary mb-4">📄 Bonafide Certificate</h2>

        {/* ✅ Search Box */}
        <div className="input-group mb-3" style={{ maxWidth: "400px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Register No"
            value={regno}
            onChange={(e) => setRegno(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleSearch}>
            Search
          </button>
        </div>

        {message && <p style={{ color: "red" }}>{message}</p>}

        {/* ✅ Student Info */}
        {student && (
          <div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Student Name</label>
                <input type="text" className="form-control fw-bold" value={student.Student_Name} readOnly />
              </div>
              <div className="col-md-6 mb-3">
                <label>Mother Name</label>
                <input type="text" className="form-control fw-bold" value={student.Mother_Name} readOnly />
              </div>
              <div className="col-md-6 mb-3">
                <label>Class</label>
                <input type="text" className="form-control fw-bold" value={student.Student_Class} readOnly />
              </div>
              <div className="col-md-6 mb-3">
                <label>Academic Year</label>
                <input type="text" className="form-control fw-bold" value={student.Class_Year} readOnly />
              </div>
              <div className="col-md-6 mb-3">
                <label>Date of Birth</label>
                <input type="text" className="form-control fw-bold" value={student.Date_Brith} readOnly />
              </div>
              <div className="col-md-6 mb-3">
                <label>Place of Birth</label>
                <input type="text" className="form-control fw-bold" value={student.Place_brith} readOnly />
              </div>
            </div>

            <div className="text-center">
              <button className="btn btn-primary" onClick={handleDownload}>
                ⬇️ Download Bonafide Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Sidebar links style
const linkStyle = {
  display: "block",
  color: "#f8f9fa",
  padding: "10px",
  textDecoration: "none",
  borderRadius: "5px",
  marginBottom: "8px",
  transition: "0.3s ease",
};
