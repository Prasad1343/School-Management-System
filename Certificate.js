import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost/Major_api/Certificate.php";

export default function Certificate() {
  const [regNo, setRegNo] = useState("");
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
    { title: "Add City", link: "/city" },
    { title: "Dashboard", link: "/Home" },
  ];

  // 🔍 Search student
  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setStudent(null);

    try {
      const formData = new FormData();
      formData.append("reg_no", regNo);

      const res = await axios.post(API_URL, formData);

      if (res.data.success) {
        setStudent(res.data.student);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("⚠️ Server error");
    }
  };

  // 🖨️ Print + DB Log
  const handlePrint = async () => {
    try {
      const formData = new FormData();
      formData.append("reg_no", regNo);
      formData.append("action", "log");

      await axios.post(API_URL, formData);

      // ✅ Print Trigger
      window.print();
    } catch (err) {
      console.error("❌ Error inserting log:", err);
      alert("⚠️ Log insert करताना error आलं!");
    }
  };

  return (
    <div className="container-fluid">
      {/* ✅ CSS */}
      <style>{`
        .sidebar-link {
          text-decoration: none;
          display: block;
          padding: 10px 15px;
          margin: 5px 0;
          border-radius: 6px;
          transition: all 0.3s ease;
        }
        .sidebar-link:hover {
          background-color: #0d6efd;
          color: #fff;
          padding-left: 20px;
        }

        /* ✅ Print Setup */
        @media print {
          @page { size: A4; margin: 20mm; }
          body * { visibility: hidden; }
          .certificate-card, .certificate-card * { visibility: visible; }
          .certificate-card {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 190mm;
            min-height: 260mm;
            box-shadow: none;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="row">
        {/* ✅ Sidebar */}
        <div className="col-md-2 sidebar bg-dark text-white p-3 no-print d-flex flex-column align-items-start" style={{ minHeight: "100vh" }}>
          <h4 className="text-center py-3 bg-secondary rounded w-100 text-white">🎓 SPKV School</h4>
          {sidebarItems.map((item, index) => (
            <Link key={index} to={item.link} className="sidebar-link text-white w-100">
              {item.title}
            </Link>
          ))}
        </div>

        {/* ✅ Main Content */}
        <div className="col-md-10 d-flex flex-column align-items-center">
          {/* 🔍 Search Box */}
          <div className="no-print mt-4 text-center w-100">
            <h2>Leaving Certificate Generator</h2>
            <form onSubmit={handleSearch} className="mx-auto mt-3" style={{ maxWidth: "400px" }}>
              <div className="mb-3">
                <label htmlFor="reg_no" className="form-label">Enter Registration Number</label>
                <input
                  type="text"
                  className="form-control text-center"
                  id="reg_no"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Search Student</button>
            </form>
          </div>

          {/* ⚠️ Message */}
          {message && <div className="alert alert-warning text-center mt-4">{message}</div>}

          {/* 🎓 Certificate Card */}
          {student && (
            <div className="certificate-wrapper w-100 d-flex justify-content-center mt-4">
              <div className="certificate-card shadow-lg p-4 bg-white rounded" style={{ maxWidth: "850px", width: "100%" }}>
                {/* ✅ Header Image */}
                <div className="text-center">
                  <img src="img/header.png" alt="School Header" className="img-fluid mb-3" style={{ maxHeight: "140px" }} />
                </div>

                <h3 className="text-center fw-bold mb-3">Leaving Certificate</h3>

                {/* ✅ Talukha hide */}
                <table className="table table-bordered text-center">
                  <tbody>
                    {Object.keys(student)
                      .filter((key) => key !== "Talukha")   // 🔥 Talukha दिसणार नाही
                      .map((key, index) => (
                        <tr key={index}>
                          <th className="w-50">{key.replace(/_/g, " ")}</th>
                          <td className="w-50" dangerouslySetInnerHTML={{ __html: student[key] }} />
                        </tr>
                      ))}
                  </tbody>
                </table>

                {/* ✅ Signature */}
                <div className="text-end mt-5">
                  <p><strong>Principal's Signature</strong></p>
                  <p>__________________________</p>
                </div>

                {/* ✅ Print Button */}
                <div className="no-print text-center mt-4">
                  <button onClick={handlePrint} className="btn btn-success px-4 py-2">
                    🖨️ Print Certificate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
