import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost/Major_api/Attendance.php";

export default function Attendance() {
  const [classes] = useState(["5th", "6th", "7th", "8th", "9th", "10th"]);
  const [selectedClass, setSelectedClass] = useState("");
  const [month, setMonth] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false); // ✅ Edit mode toggle

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

  // ✅ Fetch students & attendance
  const fetchStudents = async () => {
    if (!selectedClass || !month) {
      setMessage("⚠️ Please select Class & Month");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("action", "get_students");
      formData.append("class", selectedClass);
      formData.append("month", month);

      const res = await axios.post(API_URL, formData);

      if (res.data.success) {
        setStudents(res.data.students);
        setAttendance(res.data.attendance || {});
        setMessage("");
      } else {
        setStudents([]);
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error("❌ Server Error:", err);
      setMessage("⚠️ Server error");
    }
  };

  // ✅ Attendance update local state
  const handleAttendanceChange = (day, regNo, status) => {
    setAttendance((prev) => ({
      ...prev,
      [regNo]: {
        ...prev[regNo],
        [day]: status,
      },
    }));
  };

  // ✅ Save attendance
  const saveAttendance = async () => {
    try {
      const formData = new FormData();
      formData.append("action", "save_attendance");
      formData.append("class", selectedClass);
      formData.append("month", month);
      formData.append("attendance", JSON.stringify(attendance));

      const res = await axios.post(API_URL, formData);
      if (res.data.success) {
        setMessage("✅ Attendance saved successfully!");
        setEditMode(false); // Save केल्यावर पुन्हा lock होईल
        fetchStudents();
      } else {
        setMessage("❌ Attendance save failed.");
      }
    } catch (err) {
      console.error("❌ Save Error:", err);
      setMessage("⚠️ Error saving attendance");
    }
  };

  // ✅ Find actual days in selected month
  const getDaysInMonth = (month) => {
    if (!month) return 31;
    return new Date(2025, month, 0).getDate();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* ✅ Sidebar */}
        <div className="col-md-2 bg-dark text-white p-3 sidebar" style={{ minHeight: "100vh" }}>
          <h4 className="text-center py-3 bg-secondary rounded">🎓 SPKV School</h4>

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
        <div className="col-md-10 main-content d-flex flex-column align-items-center p-4">
          <h2 className="mb-4 text-center">📅 Monthly Attendance</h2>

          {message && <div className="alert alert-info text-center w-75">{message}</div>}

          {/* ✅ Filter Section */}
          <div className="row g-3 mb-4 w-75">
            <div className="col-md-4">
              <label className="form-label">Select Class</label>
              <select
                className="form-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Select Month</label>
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
              <button className="btn btn-primary w-100" onClick={fetchStudents}>
                🔍 Show Students
              </button>
            </div>
          </div>

          {/* ✅ Attendance Table */}
          {students.length > 0 && (
            <div className="card shadow-sm p-3 w-100">
              <div className="d-flex justify-content-between mb-3">
                <h5>
                  Class: {selectedClass} | Month:{" "}
                  {new Date(0, month - 1).toLocaleString("en", { month: "long" })}
                </h5>
                <button
                  className={`btn ${editMode ? "btn-warning" : "btn-secondary"}`}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? "🔒 Lock Editing" : "✏ Edit Attendance"}
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered text-center align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>📆 Day</th>
                      {students.map((stud) => (
                        <th key={stud.Register_No}>{stud.Student_Name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1).map(
                      (day) => (
                        <tr key={day}>
                          <td><b>{day}</b></td>
                          {students.map((stud) => (
                            <td key={stud.Register_No}>
                              <select
                                className="form-select form-select-sm"
                                value={attendance[stud.Register_No]?.[day] || ""}
                                onChange={(e) =>
                                  handleAttendanceChange(day, stud.Register_No, e.target.value)
                                }
                                disabled={!editMode}  // ✅ Edit mode नसल्यास lock
                              >
                                <option value="">-</option>
                                <option value="Present">P</option>
                                <option value="Absent">A</option>
                              </select>
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {editMode && (
                <div className="text-center">
                  <button className="btn btn-success mt-3" onClick={saveAttendance}>
                    💾 Save Attendance
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
