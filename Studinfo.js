import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Studinfo() {
  const API_URL = "http://localhost/Major_api/studinfo.php";

  const [nextRegNo, setNextRegNo] = useState(1201);
  const [nextStudentId, setNextStudentId] = useState(1234567891);

  const [motherTongues, setMotherTongues] = useState([]);
  const [subCastes, setSubCastes] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [cities, setCities] = useState([]);
  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    Student_Name: "",
    Mother_Name: "",
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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const regRes = await axios.get(`${API_URL}?getNextRegNo=1`);
      setNextRegNo(regRes.data.next_regno);

      const studentIdRes = await axios.get(`${API_URL}?getNextStudentId=1`);
      setNextStudentId(studentIdRes.data.next_studentid);

      const motherTongueRes = await axios.get(`${API_URL}?getMotherTongue=1`);
      setMotherTongues(motherTongueRes.data);

      const subCasteRes = await axios.get(`${API_URL}?getSubCaste=1`);
      setSubCastes(subCasteRes.data);

      const talukasRes = await axios.get(`${API_URL}?getTalukas=1`);
      setTalukas(talukasRes.data);

      const classesRes = await axios.get(`${API_URL}?getClasses=1`);
      setClasses(classesRes.data);
    } catch (error) {
      console.error("Fetch error:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) {
      alert("Please fix errors before submitting.");
      return;
    }

    try {
      const postData = { ...formData, save: true };
      // Student_ID handled in PHP backend, so not sending here

      const res = await axios.post(API_URL, new URLSearchParams(postData));
      if (res.data.success) {
        setMessage("✅ Student inserted successfully!");
        setFormData({
          Student_Name: "",
          Mother_Name: "",
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
        setCities([]);

        // Refresh IDs
        const regRes = await axios.get(`${API_URL}?getNextRegNo=1`);
        setNextRegNo(regRes.data.next_regno);

        const studentIdRes = await axios.get(`${API_URL}?getNextStudentId=1`);
        setNextStudentId(studentIdRes.data.next_studentid);
      } else {
        setMessage("");
        alert("Failed to insert student: " + res.data.message);
      }
    } catch (err) {
      setMessage("");
      alert("Error while inserting student");
      console.error(err);
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

        <div
          style={{
            flex: 1,
            marginLeft: "230px",
            padding: "30px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div className="container">
            <h2 className="mb-4 text-center fw-bold">
              🎓 Student Information Form
            </h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form
              onSubmit={handleSubmit}
              className="p-4 bg-white rounded shadow-sm"
            >
              <div className="row mb-4">
                <div className="col-md-4">
                  <label className="fw-semibold">Register No</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nextRegNo}
                    readOnly
                  />
                </div>

                <div className="col-md-4">
                  <label className="fw-semibold">Student ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nextStudentId}
                    readOnly
                  />
                </div>
              </div>

              {/* Student Name, Mother Name */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="fw-semibold">Student Name</label>
                  <input
                    type="text"
                    name="Student_Name"
                    className="form-control"
                    placeholder="Enter Student Name"
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
                    placeholder="Enter Mother Name"
                    value={formData.Mother_Name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Student Class */}
              <div className="row mb-3">
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
                    {Array.isArray(classes) &&
                      classes.map((cls) => (
                        <option key={cls.id} value={cls.class_name}>
                          {cls.class_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Date of Admission and Class Year */}
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

              {/* Place of Birth and Previous School */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="fw-semibold">Place of Birth</label>
                  <input
                    type="text"
                    name="Place_brith"
                    className="form-control"
                    placeholder="Enter Place of Birth"
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
                    placeholder="Enter Previous School Name"
                    value={formData.PSchool_Name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Mother Tongue and Sub Caste */}
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
                    <option value="">Select  Caste</option>
                    {subCastes.map((sc) => (
                      <option key={sc.id} value={sc.name}>
                        {sc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Taluka and City */}
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

              {/* Gender with Radio Buttons */}
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
                    <input
                      type="radio"
                      name="Gender"
                      value="Other"
                      checked={formData.Gender === "Other"}
                      onChange={handleChange}
                      className="form-check-input ms-4 me-2"
                      required
                    />
                    Other
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-3">
                Save Student
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
