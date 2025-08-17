import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost/Major_api/Pendingfee.php";

export default function PendingFee() {
  const [regno, setRegno] = useState("");
  const [student, setStudent] = useState(null);
  const [newFee, setNewFee] = useState("");
  const [message, setMessage] = useState("");

  const sidebarItems = [
    { title: "Add Students", link: "/studinfo", icon: "bi-person-plus" },
    { title: "Update Students", link: "/Update", icon: "bi-pencil-square" },
    { title: "Leaving Certificate", link: "/certificate", icon: "bi-file-earmark-text" },
    { title: "Student Fees", link: "/fee", icon: "bi-cash" },
    { title: "Pending Fees", link: "/pendingfee", icon: "bi-clock-history" },
    
    { title: "Student Enrollment", link: "/enrollment", icon: "bi-people" },
    { title: "Attendance", link: "/attendance", icon: "bi-clipboard-check" },
    { title: "Add Talukha", link: "/talukha", icon: "bi-geo-alt" },
    { title: "Add City", link: "/city", icon: "bi-building" },
    { title: "Dashboard", link: "/Home", icon: "bi-speedometer2" },
  ];

  // ✅ Search student by register number
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("action", "search");
      formData.append("regno", regno);

      const res = await axios.post(API_URL, formData);

      if (res.data.success) {
        setStudent(res.data.student);
        setMessage("");
      } else {
        setStudent(null);
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error("❌ PHP Error:", err);
      setMessage("⚠️ Server error");
    }
  };

  // ✅ Update Fee & Download Receipt
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!student) {
      setMessage("❌ Please search a student first.");
      return;
    }

    try {
      // ✅ 1) Fee update कर DB मध्ये
      const updateForm = new FormData();
      updateForm.append("action", "update_fee");
      updateForm.append("regno", student.Register_No);
      updateForm.append("new_fee", newFee);

      const res = await axios.post(API_URL, updateForm);

      if (res.data.success) {
        setMessage("✅ Fee updated successfully. Receipt downloading...");

        // ✅ 2) PDF receipt download
        window.open(
          `${API_URL}?action=receipt&regno=${student.Register_No}&new_fee=${newFee}`,
          "_blank"
        );

        setNewFee("");
      } else {
        setMessage("❌ Failed to update fee.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("⚠️ Something went wrong.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* ✅ Sidebar */}
      <div style={sidebarStyle}>
        <h4 className="text-center py-3 bg-secondary rounded">🎓 SPKV School</h4>
        {sidebarItems.map((item, index) => (
          <a key={index} href={item.link} className="sidebar-link">
            <i className={`bi ${item.icon} me-2`}></i> {item.title}
          </a>
        ))}
      </div>

      {/* ✅ Main Content */}
      <main style={{ marginLeft: "260px", width: "100%", padding: "25px" }}>
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="text-center mb-3">Search Student by Register Number</h4>
            <form className="row g-3 justify-content-center" onSubmit={handleSearch}>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Register Number"
                  value={regno}
                  onChange={(e) => setRegno(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ✅ Student Details */}
        {student && (
          <form className="card shadow-sm p-4" onSubmit={handleUpdate}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Student Name:</label>
                <input type="text" className="form-control" value={student.Student_Name} readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label">Total Fee:</label>
                <input type="text" className="form-control" value={student.Total_Fee} readOnly />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Fee Already Paid:</label>
                <input type="text" className="form-control" value={student.Fee_Entered} readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label">Pending Fee:</label>
                <input
                  type="text"
                  className="form-control"
                  value={Math.max(0, student.Total_Fee - student.Fee_Entered)}
                  readOnly
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Enter New Fee:</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={newFee}
                onChange={(e) => setNewFee(e.target.value)}
                required
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-success px-5">
                Update & Download Receipt
              </button>
            </div>
          </form>
        )}

        {/* ✅ Messages */}
        {message && <div className="alert alert-info mt-4 text-center">{message}</div>}
      </main>

      {/* ✅ Hover Effect Style */}
      <style>
        {`
          .sidebar-link {
            display: block;
            color: #ccc;
            padding: 12px 15px;
            margin: 6px 0;
            border-radius: 6px;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          .sidebar-link:hover {
            background-color: #ffc107;
            color: #000;
            padding-left: 22px;
            font-weight: 500;
          }
        `}
      </style>
    </div>
  );
}

// ✅ Sidebar Style
const sidebarStyle = {
  minWidth: "250px",
  backgroundColor: "#343a40",
  color: "white",
  height: "100vh",
  position: "fixed",
  padding: "20px",
};
