import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Fee() {
  const API_URL = "http://localhost/Major_api/Fee.php";

  const [regno, setRegno] = useState("");
  const [student, setStudent] = useState(null);
  const [enteredFee, setEnteredFee] = useState("");
  const [message, setMessage] = useState("");

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

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}?search=1&regno=${regno}`);
      if (res.data.success) {
        setStudent(res.data.student);
        setEnteredFee(res.data.student.Fee_Entered || ""); // pre-fill for update
        setMessage("");
      } else {
        setStudent(null);
        setEnteredFee("");
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("⚠️ Error fetching student.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!student) return;

    try {
      const res = await axios.post(
        API_URL,
        {
          save: true,
          Register_No: student.Register_No,
          Fee_Entered: enteredFee,
        },
        { responseType: "blob" }
      );

      const file = new Blob([res.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = fileURL;
      a.download = `Fee_Receipt_${student.Register_No}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setMessage("✅ Fee saved & receipt downloaded.");
      setEnteredFee("");
      setStudent(null);
      setRegno("");
    } catch (err) {
      setMessage("⚠️ Error saving fee.");
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ minWidth: "230px" }}>
        <h4 className="text-center py-3 bg-secondary rounded">🎓 SPKV School</h4>
        {sidebarItems.map((item, idx) => (
          <a key={idx} href={item.link} className="sidebar-link">
            {item.title}
          </a>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <h2 className="text-center text-primary mb-4">Student Fee Entry</h2>

          {message && <div className="alert alert-info text-center">{message}</div>}

          {/* Search */}
          <form onSubmit={handleSearch} className="card p-4 shadow-sm bg-white mb-3">
            <div className="row mb-3">
              <div className="col-md-8">
                <label className="form-label">Register No</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Register Number"
                  value={regno}
                  onChange={(e) => setRegno(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100">Search</button>
              </div>
            </div>
          </form>

          {/* Fee Entry */}
          {student && (
            <form onSubmit={handleSave} className="card p-4 shadow-sm bg-white">
              <div className="mb-3">
                <label className="form-label">Student Name</label>
                <input type="text" className="form-control" value={student.Student_Name} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label">Class</label>
                <input type="text" className="form-control" value={student.Student_Class} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label">Total Fee</label>
                <input type="text" className="form-control" value={student.Total_Fee} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label">Fee Entered</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter new total fee (overwrite)"
                  value={enteredFee}
                  onChange={(e) => setEnteredFee(e.target.value)}
                  required
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-success px-5">Update Fee Entry</button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>
        {`
          .sidebar-link {
            display: block;
            padding: 10px 15px;
            color: #ccc;
            text-decoration: none;
            transition: 0.2s;
          }
          .sidebar-link:hover {
            background: #495057;
            color: #fff;
            padding-left: 20px;
            border-radius: 5px;
          }
        `}
      </style>
    </div>
  );
}
