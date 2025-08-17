import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Talukha() {
  const API_URL = "http://localhost/Major_api/Talukha.php";

  const [talukaName, setTalukaName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Sidebar Items (Dynamic)
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

  // ✅ Add Taluka
  const addTaluka = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, { action: "add", name: talukaName });
      setMessage(res.data.success || res.data.error);
      setTalukaName("");
    } catch (err) {
      setMessage("❌ Error adding Taluka");
    }
  };

  // ✅ Search Taluka
  const searchTaluka = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}?id=${searchId}`);
      if (res.data.error) {
        setMessage(res.data.error);
        setSearchResult(null);
      } else {
        setSearchResult(res.data);
        setMessage("");
      }
    } catch (err) {
      setMessage("❌ Taluka not found");
    }
  };

  // ✅ Update Taluka
  const updateTaluka = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(API_URL, {
        id: searchResult.id,
        name: searchResult.name,
      });
      setMessage(res.data.success || res.data.error);
    } catch (err) {
      setMessage("❌ Error updating Taluka");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      
      {/* ✅ Sidebar */}
      <div style={sidebarStyle}>
        <h4 className="text-center py-3 bg-secondary rounded">🎓 SPKV School</h4>

        {/* 🔹 Dynamic Sidebar Links */}
        {sidebarItems.map((item, index) => (
          <a key={index} href={item.link} className="sidebar-link">
            <i className={`bi ${item.icon} me-2`}></i> {item.title}
          </a>
        ))}
      </div>

      {/* ✅ Main Content */}
      <div className="main-content" style={{ marginLeft: "260px", padding: "30px", width: "100%" }}>
        <h3 className="text-center text-primary mb-4">🏷️ Taluka Add, Search & Update</h3>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="row g-4">
          {/* ➕ Add Taluka */}
          <div className="col-md-6 mx-auto">
            <div className="card shadow">
              <div className="card-header bg-success text-white">➕ Add New Taluka</div>
              <div className="card-body">
                <form onSubmit={addTaluka}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter Taluka Name"
                    value={talukaName}
                    onChange={(e) => setTalukaName(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-success w-100">Add Taluka</button>
                </form>
              </div>
            </div>
          </div>

          {/* 🔍 Search Taluka */}
          <div className="col-md-6 mx-auto">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">🔍 Search Taluka</div>
              <div className="card-body">
                <form onSubmit={searchTaluka}>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Enter Taluka ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary w-100">Search</button>
                </form>
              </div>
            </div>
          </div>

          {/* ✏️ Update Taluka */}
          {searchResult && (
            <div className="col-md-6 mx-auto">
              <div className="card shadow">
                <div className="card-header bg-warning text-dark">✏️ Update Taluka</div>
                <div className="card-body">
                  <form onSubmit={updateTaluka}>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={searchResult.name}
                      onChange={(e) => setSearchResult({ ...searchResult, name: e.target.value })}
                      required
                    />
                    <button type="submit" className="btn btn-warning w-100">Update</button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
            background-color: #ab9b6dff;
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
  width: "250px",
  backgroundColor: "#343a40",
  color: "white",
  height: "100vh",
  position: "fixed",
  padding: "20px",
};
