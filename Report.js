import React, { useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost/Major_api/report.php";

export default function Report() {
  const [reportType, setReportType] = useState("Fees");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [className, setClassName] = useState("");
  const [rows, setRows] = useState([]);
  const [totalFee, setTotalFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const classes = ["5th", "6th", "7th", "8th", "9th", "10th"];

  const sidebarItems = [
    { title: "Add Students", link: "/studinfo" },
    { title: "Update Students", link: "/Update" },
    { title: "Leaving Certificate", link: "/certificate" },
    { title: "Student Fees", link: "/fee" },
    { title: "Pending Fees", link: "/pendingfee" },
    { title: "Student Enrollment", link: "/enrollment" },
    { title: "Attendance", link: "/attendance" },
    { title: "Add City", link: "/city" },
    { title: "Dashboard", link: "/Home" },
  ];

  const isAttendance = reportType === "Attendance";

  const canFetch = useMemo(() => {
    if (isAttendance) return !!className;
    return !!fromDate && !!toDate;
  }, [isAttendance, className, fromDate, toDate]);

  const handleFetch = async () => {
    if (!canFetch) {
      setMsg(
        isAttendance
          ? "⚠️ Please select Class."
          : "⚠️ Please select From and To dates."
      );
      return;
    }
    setMsg("");
    setLoading(true);
    setRows([]);
    setTotalFee(0);

    try {
      const formData = new FormData();
      if (isAttendance) {
        formData.append("action", "attendance_fetch");
        formData.append("class", className);
      } else {
        formData.append("action", "fetch");
        formData.append("report_type", reportType);
        formData.append("from", fromDate);
        formData.append("to", toDate);
      }

      const res = await axios.post(API_URL, formData);
      const payload = res.data;

      if (isAttendance) {
        const data = Array.isArray(payload?.data) ? payload.data : [];
        setRows(data);
        setMsg(data.length ? "" : "No attendance found.");
      } else {
        if (payload?.success) {
          const data = Array.isArray(payload?.data) ? payload.data : [];
          setRows(data);
          setTotalFee(payload?.total_fee || 0);
          setMsg(data.length ? "" : "No records found.");
        } else {
          setMsg(payload?.message || "No records found.");
        }
      }
    } catch (e) {
      console.error(e);
      setMsg("Server error while fetching report.");
    } finally {
      setLoading(false);
    }
  };

  const handlePDF = async () => {
    if (!canFetch || isAttendance) return;
    try {
      const formData = new FormData();
      formData.append("action", "pdf");
      formData.append("report_type", reportType);
      formData.append("from", fromDate);
      formData.append("to", toDate);

      const res = await axios.post(API_URL, formData, { responseType: "blob" });
      const file = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);
      window.open(url, "_blank");
    } catch (err) {
      console.error("PDF Error:", err);
      setMsg("Failed to generate PDF.");
    }
  };

  const handleExcel = () => {
    if (!isAttendance) return;
    if (!rows.length) {
      setMsg("No attendance data to export.");
      return;
    }
    // Excel: फक्त Date/Status हवे असतील तर खालील map वापर:
    // const exportRows = rows.map(r => ({ Date: r.Date, Status: r.Status }));
    const exportRows = rows; // सध्या पूर्ण डेटा
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `Attendance_${className || "Class"}_${Date.now()}.xlsx`);
  };

  // Column order (stable headers)
  const headers = useMemo(() => {
    if (isAttendance) return ["Register_No", "Student_Name", "Class", "Date", "Status"];
    if (reportType === "Fees") return ["Register_No", "Student_Name", "class", "Fee_Entered", "date"];
    return ["Register_No", "Student_Name", "class", "date"]; // Bonafide / Leaving Certificate
  }, [isAttendance, reportType]);

  const headerLabels = {
    Register_No: "Register No",
    Student_Name: "Student Name",
    Class: "class",
    Fee_Entered: "Fee Entered",
    date: "Date",
    Date: "Date",
    Status: "Status",
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 bg-dark text-white p-3" style={{ minHeight: "100vh" }}>
          <h4 className="text-center py-3 bg-secondary rounded">🎓 SPKV School</h4>

          <style>
            {`
              .sidebar-link {
                transition: all 0.3s ease;
                display: block;
                margin: 5px 0;
                padding: 10px;
                border-radius: 8px;
                color:#fff;
                text-decoration:none;
              }
              .sidebar-link:hover {
                background-color: #0d6efd;
                color: #fff;
                padding-left: 15px;
              }
            `}
          </style>

          {sidebarItems.map((item, idx) => (
            <Link key={idx} to={item.link} className="sidebar-link">
              {item.title}
            </Link>
          ))}
        </div>

        {/* Main */}
        <div className="col-md-10 p-4">
          <h2 className="text-center mb-4">📊 Reports</h2>

          {/* Filters */}
          <div className="card shadow-sm p-3">
            <div className="row g-3">
              <div className={isAttendance ? "col-md-4" : "col-md-3"}>
                <label className="form-label">Report Type</label>
                <select
                  className="form-select"
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value);
                    setRows([]);
                    setTotalFee(0);
                    setMsg("");
                    setClassName("");
                  }}
                >
                  <option>Fees</option>
                  <option>Bonafide</option>
                  <option>Leaving Certificate</option>
                  <option>Attendance</option>
                </select>
              </div>

              {isAttendance ? (
                <>
                  <div className="col-md-5">
                    <label className="form-label">Class</label>
                    <select
                      className="form-select"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                    >
                      <option value="">-- Select Class --</option>
                      {classes.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <button className="btn btn-primary w-100" onClick={handleFetch}>
                      🔍 Show Report
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-md-3">
                    <label className="form-label">From Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">To Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <button className="btn btn-primary w-100" onClick={handleFetch}>
                      🔍 Show Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Message */}
          {msg && <div className="alert alert-info mt-3">{msg}</div>}

          {/* Table + Actions */}
          {loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : rows.length > 0 ? (
            <div className="card shadow-sm p-3 mt-3">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                <h5 className="mb-2">
                  {isAttendance
                    ? `Attendance - Class: ${className}`
                    : `${reportType} Report (${fromDate} to ${toDate})`}
                </h5>

                <div className="d-flex gap-2">
                  {!isAttendance && (
                    <button className="btn btn-success" onClick={handlePDF}>
                      📄 Download PDF
                    </button>
                  )}
                  {isAttendance && (
                    <button className="btn btn-success" onClick={handleExcel}>
                      📥 Export to Excel
                    </button>
                  )}
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-striped text-center">
                  <thead className="table-dark">
                    <tr>
                      {headers.map((h) => (
                        <th key={h}>{headerLabels[h] || h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i}>
                        {headers.map((h) => (
                          <td key={h + i}>{r[h]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!isAttendance && reportType === "Fees" && (
                <h5 className="text-end mt-3">
                  <b>Total Fee Collected: ₹ {totalFee}</b>
                </h5>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
