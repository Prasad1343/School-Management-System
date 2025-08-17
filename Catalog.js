import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost/Major_api/Catalog.php";

export default function Catalog() {
  const [registerNo, setRegisterNo] = useState("");
  const [month, setMonth] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({ present_days: 0, absent_days: 0 });
  const [studentName, setStudentName] = useState("");
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

  // ✅ Search student attendance summary
  const searchAttendance = async () => {
    if (!registerNo || !month) {
      setMessage("⚠️ Please enter register number & select month.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("action", "search");
      formData.append("register_no", registerNo);
      formData.append("month", month);

      const res = await axios.post(API_URL, formData);

      if (res.data.success) {
        setAttendance(res.data.attendance_list);
        setSummary(res.data.summary);
        setStudentName(res.data.student_name);
        setMessage("");
      } else {
        setAttendance([]);
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      setMessage("⚠️ Server error occurred");
    }
  };

  // ✅ PDF Download
  const downloadPDF = async () => {
    try {
      const formData = new FormData();
      formData.append("export_pdf", true);
      formData.append("register_no", registerNo);
      formData.append("month", month);

      const res = await axios.post(API_URL, formData, {
        responseType: "blob", // important for PDF
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Attendance_${registerNo}_${month}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("❌ PDF Error:", err);
      setMessage("⚠️ PDF download failed");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* ✅ Sidebar */}
        <div className="col-md-2 bg-dark text-white p-3 sidebar" style={{ minHeight: "100vh" }}>
          <h4 className="text-center py-3 bg-secondary rounded">🎓 SPKV School</h4>

          {/* ✅ Sidebar Hover Style */}
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

          {sidebarItems.map((item, index) => (
            <Link key={index} to={item.link} className="sidebar-link">
              {item.title}
            </Link>
          ))}
        </div>

        {/* ✅ Main Content */}
        <div className="col-md-10 p-4">
          <h2 className="mb-4 text-center">📊 Student Attendance Summary</h2>

          {message && <div className="alert alert-warning text-center">{message}</div>}

          {/* 🔍 Search Form */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label">Register No</label>
              <input
                type="number"
                className="form-control"
                value={registerNo}
                onChange={(e) => setRegisterNo(e.target.value)}
                placeholder="Enter Register Number"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Month</label>
              <select
                className="form-select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">-- Select Month --</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(0, m - 1).toLocaleString("en", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 align-self-end">
              <button className="btn btn-primary w-100" onClick={searchAttendance}>
                🔍 Show Summary
              </button>
            </div>
          </div>

          {/* ✅ Attendance Summary Table */}
          {attendance.length > 0 && (
            <div className="card shadow">
              <div className="card-header bg-info text-white">
                Attendance Details for <strong>{studentName}</strong> (
                {new Date(0, month - 1).toLocaleString("en", { month: "long" })})
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((row, index) => (
                        <tr key={index}>
                          <td>{row.day}</td>
                          <td>{new Date(row.day).toLocaleString("en", { weekday: "long" })}</td>
                          <td>
                            {row.status === "Present" ? (
                              <span className="text-success">✅ Present</span>
                            ) : (
                              <span className="text-danger">❌ Absent</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h5 className="mt-3">
                  ✅ Present Days: <span className="text-success">{summary.present_days}</span>
                </h5>
                <h5>
                  ❌ Absent Days: <span className="text-danger">{summary.absent_days}</span>
                </h5>

                {/* PDF Export Button */}
                <button className="btn btn-danger mt-3" onClick={downloadPDF}>
                  📄 Download Full PDF
                </button>
              </div>
            </div>
          )}

          {/* No Record Found */}
          {attendance.length === 0 && !message && (
            <div className="alert alert-info text-center">
              Enter Register Number & Month to see attendance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
