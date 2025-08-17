import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost/Major_api/enrollment.php";

export default function Enrollment() {
  const [regNo, setRegNo] = useState("");
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [newClass, setNewClass] = useState("");
  const [newClassFee, setNewClassFee] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pendingFee, setPendingFee] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const classFeeMap = {
    "5th": 3500,
    "6th": 4000,
    "7th": 4500,
    "8th": 5000,
    "9th": 5500,
    "10th": 6000,
  };

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
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("action", "search");
      formData.append("reg", regNo);

      const res = await axios.post(API_URL, formData);

      if (res.data.success) {
        setStudents(res.data.students);
        setMessage("");
        setShowReceipt(false);
      } else {
        setStudents([]);
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("⚠️ Server error");
    }
  };

  const handleSelectStudent = (stud) => {
    setSelectedStudent(stud);
    setPendingFee(stud.pending_fee);
    setTotalPending(stud.pending_fee);
    setShowReceipt(false);
  };

  const handlePayFee = async (e) => {
    e.preventDefault();
    const feePaid = document.getElementById("fee_paid").value;

    try {
      const formData = new FormData();
      formData.append("action", "pay_fee");
      formData.append("reg", selectedStudent.Register_No);
      formData.append("fee_paid", feePaid);

      const res = await axios.post(API_URL, formData);

      if (res.data.success) {
        setSelectedStudent(res.data.student);
        setPendingFee(res.data.pending_fee);
        setTotalPending(res.data.pending_fee + newClassFee);
        setMessage("✅ Fee updated successfully.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Server error");
    }
  };

  const handlePromote = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("action", "promote");
      formData.append("reg", selectedStudent.Register_No);
      formData.append("new_class", newClass);
      formData.append("new_class_fee", newClassFee);

      const res = await axios.post(API_URL, formData);

      if (res.data.success) {
        setSelectedStudent(res.data.student);
        setPendingFee(res.data.pending_fee);
        setTotalPending(res.data.pending_fee);
        setShowReceipt(true);
        setMessage("✅ Promotion successful.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Server error");
    }
  };

  const handleClassChange = (value) => {
    setNewClass(value);
    const fee = classFeeMap[value] || 0;
    setNewClassFee(fee);
    setTotalPending(pendingFee + fee);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    const name = document.getElementById("update_name").value;
    const cls = document.getElementById("update_class").value;
    const fee = document.getElementById("update_fee").value;

    try {
      const formData = new FormData();
      formData.append("action", "update_student");
      formData.append("reg", selectedStudent.Register_No);
      formData.append("name", name);
      formData.append("class", cls);
      formData.append("fee", fee);

      const res = await axios.post(API_URL, formData);
      if (res.data.success) {
        setSelectedStudent(res.data.student);
        setMessage("✅ Student details updated successfully!");
      } else {
        setMessage("❌ Update failed.");
      }
    } catch (err) {
      console.error("❌ Update Error:", err);
      setMessage("⚠️ Server error");
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3 shadow"
        style={{
          width: "250px",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        <h4 className="text-center py-3 bg-secondary rounded mb-4">
          🎓 SPKV School
        </h4>
        {sidebarItems.map((item, index) => (
          <a key={index} href={item.link} className="sidebar-link">
            {item.title}
          </a>
        ))}
      </div>

      {/* Main Content */}
      <div className="container" style={{ marginLeft: "260px", padding: "20px" }}>
        <h3 className="text-center text-primary mb-4">
          🎓 Student Enrollment & Promotion
        </h3>

        {/* Search */}
        <form onSubmit={handleSearch} className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Register No (e.g. 121)"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-success w-100">
              Search
            </button>
          </div>
        </form>

        {message && <div className="alert alert-warning mt-3">{message}</div>}

        {/* Student list */}
        {students.length > 0 && (
          <div className="mt-4">
            <h5>Search Results:</h5>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Register No</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Total Fee</th>
                  <th>Fee Paid</th>
                  <th>Pending Fee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stud, index) => (
                  <tr key={index}>
                    <td>{stud.Register_No}</td>
                    <td>{stud.Student_Name}</td>
                    <td>{stud.Stud_Studying}</td>
                    <td>₹{stud.Total_Fee}</td>
                    <td>₹{stud.Fee_Entered}</td>
                    <td>₹{stud.pending_fee}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSelectStudent(stud)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Selected Student Details */}
        {selectedStudent && (
          <div className="card mt-4 shadow">
            <div className="card-body">
              <h5>Selected Student Details</h5>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Register No</th>
                    <td>{selectedStudent.Register_No}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{selectedStudent.Student_Name}</td>
                  </tr>
                  <tr>
                    <th>Class</th>
                    <td>{selectedStudent.Stud_Studying}</td>
                  </tr>
                  <tr>
                    <th>Total Fee</th>
                    <td>₹{selectedStudent.Total_Fee}</td>
                  </tr>
                  <tr>
                    <th>Fee Paid</th>
                    <td>₹{selectedStudent.Fee_Entered}</td>
                  </tr>
                  <tr>
                    <th>Pending Fee</th>
                    <td>₹{pendingFee}</td>
                  </tr>
                </tbody>
              </table>

              {/* Pay Fee */}
              <form onSubmit={handlePayFee} className="row g-3">
                <div className="col-md-3">
                  <label>Enter Fee Paid:</label>
                  <input type="number" id="fee_paid" className="form-control" required />
                </div>
                <div className="col-md-2 mt-4">
                  <button type="submit" className="btn btn-warning">
                    Submit Fee
                  </button>
                </div>
              </form>

              {/* Promote */}
              <form onSubmit={handlePromote} className="row g-3 mt-4">
                <div className="col-md-3">
                  <label>Promote To:</label>
                  <select
                    className="form-select"
                    value={newClass}
                    onChange={(e) => handleClassChange(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="5th">5th</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <label>New Class Fee:</label>
                  <input type="number" className="form-control" value={newClassFee} readOnly />
                </div>

                <div className="col-md-2">
                  <label>Total Pending:</label>
                  <input type="number" className="form-control" value={totalPending} readOnly />
                </div>

                <div className="col-md-2 mt-4">
                  <button type="submit" className="btn btn-primary">
                    Promote
                  </button>
                </div>
              </form>

              {/* Update Student Form */}
              <form onSubmit={handleUpdateStudent} className="row g-3 mt-4 border-top pt-3">
                <h5>✏ Update Student Details</h5>

                <div className="col-md-3">
                  <label>Update Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="update_name"
                    defaultValue={selectedStudent.Student_Name}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label>Update Class:</label>
                  <select
                    className="form-select"
                    id="update_class"
                    defaultValue={selectedStudent.Stud_Studying}
                    required
                  >
                    <option value="5th">5th</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label>Update Total Fee:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="update_fee"
                    defaultValue={selectedStudent.Total_Fee}
                    required
                  />
                </div>

                <div className="col-md-2 mt-4">
                  <button type="submit" className="btn btn-info">🔄 Update</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Receipt */}
        {showReceipt && (
          <div className="card mt-4 p-3 shadow">
            <h5 className="text-success">Promotion Receipt</h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Register No</th>
                  <td>{selectedStudent.Register_No}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{selectedStudent.Student_Name}</td>
                </tr>
                <tr>
                  <th>Promoted To</th>
                  <td>{selectedStudent.Stud_Studying}</td>
                </tr>
                <tr>
                  <th>Total Fee</th>
                  <td>₹{selectedStudent.Total_Fee}</td>
                </tr>
                <tr>
                  <th>Pending Fee</th>
                  <td>₹{selectedStudent.Total_Fee - selectedStudent.Fee_Entered}</td>
                </tr>
              </tbody>
            </table>
            <button onClick={() => window.print()} className="btn btn-outline-dark">
              🖨️ Print / Save as PDF
            </button>
          </div>
        )}
      </div>

      {/* Sidebar CSS */}
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
            background-color: #b18a5798;
            color: #fff;
            padding-left: 25px;
          }
        `}
      </style>
    </div>
  );
}
