import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function UpdateStudent() {
  const API_URL = "http://localhost/Major_api/update.php";

  const [registerNo, setRegisterNo] = useState("");
  const [studentFound, setStudentFound] = useState(false);
  const [motherTongues, setMotherTongues] = useState([]);
  const [subCastes, setSubCastes] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [cities, setCities] = useState([]);
  const [classes, setClasses] = useState([]);  // For classes dropdown

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    Student_Name: "",
    Mother_Name: "",
    Student_ID: "",
    Student_Class: "",
    Class_Year: "",
    Mother_Tounge: "",
    Sub_Cast: "",
    Place_brith: "",
    Date_Brith: "",
    PSchool_Name: "",
    Date_Admission: "",
    Taluka: "",
    City: "",
    Gender: "",
  });

  // Sidebar items
  const sidebarItems = [
    { title: "Add Students", link: "/studinfo" },
    { title: "Update Students", link: "/update" },
    { title: "Leaving Certificate", link: "/certificate" },
    { title: "Student Fees", link: "/fee" },
    { title: "Pending Fees", link: "/pendingfee" },
    { title: "Student Enrollment", link: "/enrollment" },
    { title: "Attendance", link: "/attendance" },
    { title: "Add Talukha", link: "/talukha" },
    { title: "Add City", link: "/city" },
    { title: "Dashboard", link: "/Home" },
  ];

  useEffect(() => {
    fetchMotherTongues();
    fetchSubCastes();
    fetchTalukas();
    fetchClasses();  // fetch classes on mount
  }, []);

  const fetchMotherTongues = async () => {
    try {
      const res = await axios.get(`${API_URL}?getMotherTongue=1`);
      setMotherTongues(res.data);
    } catch (error) {
      console.error("Error fetching mother tongues:", error);
    }
  };

  const fetchSubCastes = async () => {
    try {
      const res = await axios.get(`${API_URL}?getSubCaste=1`);
      setSubCastes(res.data);
    } catch (error) {
      console.error("Error fetching sub castes:", error);
    }
  };

  const fetchTalukas = async () => {
    try {
      const res = await axios.get(`${API_URL}?getTalukas=1`);
      setTalukas(res.data);
    } catch (error) {
      console.error("Error fetching talukas:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_URL}?getClasses=1`);
      setClasses(res.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleTalukaChange = async (e) => {
    const talukaName = e.target.value;
    setFormData({ ...formData, Taluka: talukaName, City: "" });

    const selectedTaluka = talukas.find((t) => t.name === talukaName);
    if (selectedTaluka) {
      try {
        const res = await axios.get(
          `${API_URL}?getCities=1&taluka_id=${selectedTaluka.id}`
        );
        setCities(res.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setCities([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdmissionChange = (e) => {
    const admissionDate = e.target.value;
    let classYear = "";
    if (admissionDate) {
      const year = new Date(admissionDate).getFullYear();
      classYear = `${year}-${(year + 1).toString().slice(-2)}`;
    }
    setFormData({
      ...formData,
      Date_Admission: admissionDate,
      Class_Year: classYear,
    });
  };

  const handleDOBChange = (e) => {
    const dob = e.target.value;
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 10) {
      setError("❌ Student must be at least 10 years old for 5th class.");
    } else {
      setError("");
    }
    setFormData({ ...formData, Date_Brith: dob });
  };

  const handleSearch = async () => {
    if (!registerNo) {
      alert("Enter Register No first!");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}?getStudent=${registerNo}`);
      if (res.data.success) {
        setFormData(res.data.student);
        setStudentFound(true);
        setMessage("");
        // fetch cities based on taluka
        if (res.data.student.Taluka) {
          const selectedTaluka = talukas.find(
            (t) => t.name === res.data.student.Taluka
          );
          if (selectedTaluka) {
            const cityRes = await axios.get(
              `${API_URL}?getCities=1&taluka_id=${selectedTaluka.id}`
            );
            setCities(cityRes.data);
          }
        }
      } else {
        setStudentFound(false);
        setMessage("❌ Student not found!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error fetching student!");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (error) {
      alert("Fix errors before updating.");
      return;
    }

    try {
      const res = await axios.post(API_URL, {
        ...formData,
        update: true,
        Register_No: registerNo,
      });
      if (res.data.success) {
        setMessage("✅ Student updated successfully!");
      } else {
        setMessage("❌ Update failed!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Update failed!");
    }
  };

  return (
    <>
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
            transition: all 0.3s ease;
          }
        `}
      </style>

      <div className="d-flex">
        {/* Sidebar */}
        <div
          style={{
            width: "230px",
            backgroundColor: "#212529",
            color: "#fff",
            minHeight: "100vh",
            position: "fixed",
            paddingTop: "20px",
          }}
        >
          <h4 className="text-center mb-4">📚 SPKV School</h4>
          {sidebarItems.map((item, index) => (
            <Link key={index} to={item.link} className="sidebar-link">
              {item.title}
            </Link>
          ))}
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            marginLeft: "230px",
            padding: "30px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div className="container">
            <h2 className="mb-4 text-center fw-bold">✏️ Update Student Form</h2>

            {/* Search box */}
            <div className="input-group mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Register No"
                value={registerNo}
                onChange={(e) => setRegisterNo(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleSearch}>
                Search
              </button>
            </div>

            {message && <div className="alert alert-info">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {studentFound && (
              <form
                onSubmit={handleUpdate}
                className="p-4 bg-white rounded shadow-sm"
              >
                {/* Student Name & Mother Name */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="fw-semibold">Student Name</label>
                    <input
                      type="text"
                      name="Student_Name"
                      className="form-control"
                      value={formData.Student_Name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="fw-semibold">Mother Name</label>
                    <input
                      type="text"
                      name="Mother_Name"
                      className="form-control"
                      value={formData.Mother_Name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Gender (Radio buttons) */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="fw-semibold">Gender</label>
                    <div>
                      <input
                        type="radio"
                        name="Gender"
                        value="Male"
                        checked={formData.Gender === "Male"}
                        onChange={handleChange}
                        className="form-check-input me-2"
                        required
                      />
                      Male
                      <input
                        type="radio"
                        name="Gender"
                        value="Female"
                        checked={formData.Gender === "Female"}
                        onChange={handleChange}
                        className="form-check-input ms-4 me-2"
                        required
                      />
                      Female
                    </div>
                  </div>
                </div>

                {/* Student ID & Class */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="fw-semibold">Student ID</label>
                    <input
                      type="text"
                      name="Student_ID"
                      className="form-control"
                      value={formData.Student_ID}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="fw-semibold">Student Class</label>
                    <select
                      name="Student_Class"
                      className="form-select"
                      value={formData.Student_Class}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.class_name}>
                          {cls.class_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date of Admission & Class Year */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="fw-semibold">Date of Admission</label>
                    <input
                      type="date"
                      name="Date_Admission"
                      className="form-control"
                      value={formData.Date_Admission}
                      onChange={handleAdmissionChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="fw-semibold">Class Year</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.Class_Year}
                      readOnly
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="fw-semibold">Date of Birth</label>
                    <input
                      type="date"
                      name="Date_Brith"
                      className="form-control"
                      value={formData.Date_Brith}
                      onChange={handleDOBChange}
                      required
                    />
                  </div>
                </div>

                {/* Place of Birth & Previous School */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="fw-semibold">Place of Birth</label>
                    <input
                      type="text"
                      name="Place_brith"
                      className="form-control"
                      value={formData.Place_brith}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="fw-semibold">Previous School Name</label>
                    <input
                      type="text"
                      name="PSchool_Name"
                      className="form-control"
                      value={formData.PSchool_Name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Mother Tongue & Sub Caste */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="fw-semibold">Mother Tongue</label>
                    <select
                      name="Mother_Tounge"
                      className="form-select"
                      value={formData.Mother_Tounge}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Mother Tongue</option>
                      {motherTongues.map((mt) => (
                        <option key={mt.id} value={mt.name}>
                          {mt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="fw-semibold">Sub Caste</label>
                    <select
                      name="Sub_Cast"
                      className="form-select"
                      value={formData.Sub_Cast}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Sub Caste</option>
                      {subCastes.map((sc) => (
                        <option key={sc.id} value={sc.name}>
                          {sc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Taluka & City */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="fw-semibold">Taluka</label>
                    <select
                      name="Taluka"
                      className="form-select"
                      value={formData.Taluka}
                      onChange={handleTalukaChange}
                      required
                    >
                      <option value="">Select Taluka</option>
                      {talukas.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="fw-semibold">City</label>
                    <select
                      name="City"
                      className="form-select"
                      value={formData.City}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Update Button */}
                <div className="text-center">
                  <button type="submit" className="btn btn-success px-5 py-2">
                    <i className="bi bi-arrow-repeat"></i> Update
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
