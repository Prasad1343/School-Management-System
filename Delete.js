import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Delete() {
  const API_URL = "http://localhost/Major_api/Delete.php";

  const [regno, setRegno] = useState("");
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

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

  // 🔍 Search Student
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}?search=1&regno=${regno}`);
      if (res.data.success) {
        setStudent(res.data.student);
        setMessage("");
        setMsgType("");
      } else {
        setStudent(null);
        setMessage(res.data.message);
        setMsgType("warning");
      }
    } catch (error) {
      console.error("❌ Search Error:", error);
      setMessage("⚠️ Error fetching student data.");
      setMsgType("danger");
    }
  };

  // 🗑️ Delete Student
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await axios.post(API_URL, { delete: true, Register_No: student?.Register_No });
      if (res.data.success) {
        setMessage(res.data.message);
        setMsgType("success");
        setStudent(null);
        setRegno("");
      } else {
        setMessage(res.data.message);
        setMsgType("danger");
      }
    } catch (error) {
      console.error("❌ Delete Error:", error);
      setMessage("⚠️ Error deleting student.");
      setMsgType("danger");
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      {/* ✅ Sidebar */}
      <div className="bg-dark text-white p-3" style={{ minWidth: "250px" }}>
        <h4 className="text-center py-3 bg-secondary rounded">🎓 SPKV School</h4>

        {/* ✅ Sidebar Items Map केले */}
        {sidebarItems.map((item, index) => (
          <a key={index} href={item.link} style={linkStyle}>
            {item.title}
          </a>
        ))}
      </div>

      {/* ✅ Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <h2 className="mb-4 text-danger text-center">🗑️ Search & Delete Student</h2>

          {/* ✅ Alert */}
          {message && <div className={`alert alert-${msgType} text-center`}>{message}</div>}

          {/* 🔍 Search Box */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Register No"
                value={regno}
                onChange={(e) => setRegno(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-success">🔍 Search</button>
            </div>
          </form>

          {/* 📝 Full Form – फक्त search झाल्यावर */}
          {student && (
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="row">
                {/* Register No */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Register No</label>
                  <input type="text" className="form-control" value={student?.Register_No || ""} readOnly />
                </div>

                {/* Student Name */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Student Name</label>
                  <input type="text" className="form-control" value={student?.Student_Name || ""} readOnly />
                </div>

                {/* Mother Name */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Mother Name</label>
                  <input type="text" className="form-control" value={student?.Mother_Name || ""} readOnly />
                </div>

                {/* Student ID */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Student ID</label>
                  <input type="text" className="form-control" value={student?.Student_ID || ""} readOnly />
                </div>

                {/* Student Class */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Student Class</label>
                  <input type="text" className="form-control" value={student?.Student_Class || ""} readOnly />
                </div>

                {/* ❌ Currently Studying काढला */}

                {/* Class Year */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Class Year</label>
                  <input type="text" className="form-control" value={student?.Class_Year || ""} readOnly />
                </div>

                {/* Mother Tongue */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Mother Tongue</label>
                  <input type="text" className="form-control" value={student?.Mother_Tounge || ""} readOnly />
                </div>

                {/* Sub Caste */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Sub Caste</label>
                  <input type="text" className="form-control" value={student?.Sub_Cast || ""} readOnly />
                </div>

                {/* Place of Birth */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Place of Birth</label>
                  <input type="text" className="form-control" value={student?.Place_brith || ""} readOnly />
                </div>

                {/* Date of Birth */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Date of Birth</label>
                  <input type="date" className="form-control" value={student?.Date_Brith || ""} readOnly />
                </div>

                {/* Previous School */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Previous School</label>
                  <input type="text" className="form-control" value={student?.PSchool_Name || ""} readOnly />
                </div>

                {/* Date of Admission */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Date of Admission</label>
                  <input type="date" className="form-control" value={student?.Date_Admission || ""} readOnly />
                </div>

                {/* ✅ Taluka */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">Taluka</label>
                  <input type="text" className="form-control" value={student?.Taluka || ""} readOnly />
                </div>

                {/* ✅ City */}
                <div className="col-md-6 mb-3">
                  <label className="fw-bold">City</label>
                  <input type="text" className="form-control" value={student?.City || ""} readOnly />
                </div>
              </div>

              {/* 🗑️ Delete Button */}
              <div className="text-center mt-4">
                <button className="btn btn-danger px-4" onClick={handleDelete}>
                  <i className="bi bi-trash"></i> Delete Student
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ Sidebar link style
const linkStyle = {
  display: "block",
  padding: "12px 18px",
  color: "white",
  textDecoration: "none",
  fontSize: "16px"
};
