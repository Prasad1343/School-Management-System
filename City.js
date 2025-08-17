import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function City() {
  const API_URL = "http://localhost/Major_api/city_api.php";

  const [talukaId, setTalukaId] = useState("");
  const [cityName, setCityName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchTalukaId, setSearchTalukaId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [cities, setCities] = useState([]);
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

  // ✅ सुरुवातीला सर्व cities load करणे
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get(API_URL);
      setCities(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMessage("❌ Error fetching cities");
    }
  };

  // ✅ Add City
  const addCity = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, { taluka_id: talukaId, name: cityName });
      setMessage(res.data.success || res.data.error);
      setTalukaId("");
      setCityName("");
      fetchCities();
    } catch {
      setMessage("❌ Error adding city");
    }
  };

  // ✅ Search City
  const searchCity = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}?id=${searchId}&taluka_id=${searchTalukaId}`);
      if (res.data.error) {
        setMessage(res.data.error);
        setSearchResult(null);
      } else {
        setSearchResult(res.data);
      }
    } catch {
      setMessage("⚠️ No city found");
    }
  };

  // ✅ Update City
  const updateCity = async (id, taluka_id, name) => {
    try {
      const res = await axios.put(API_URL, { id, taluka_id, name });
      setMessage(res.data.success || res.data.error);
      fetchCities();
    } catch {
      setMessage("❌ Error updating city");
    }
  };

  // ✅ Delete City
  const deleteCity = async (id) => {
    if (!window.confirm("Delete this city?")) return;
    try {
      const res = await axios.delete(API_URL, { data: { id } });
      setMessage(res.data.success || res.data.error);
      fetchCities();
    } catch {
      setMessage("❌ Error deleting city");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* ✅ Sidebar */}
      <div className="sidebar" style={sidebarStyle}>
        <h4 className="text-center">🎓 SPKV School</h4>
        {sidebarItems.map((item, index) => (
          <a key={index} href={item.link} style={linkStyle}>
            {item.title}
          </a>
        ))}
      </div>

      {/* ✅ Main Content */}
      <div className="content" style={{ marginLeft: "260px", padding: "20px", width: "100%" }}>
        <h2 className="text-center mb-4">🏙️ City Management System</h2>

        {message && <div className="alert alert-info">{message}</div>}

        {/* ➕ Add City */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">➕ Add New City</div>
          <div className="card-body">
            <form onSubmit={addCity} className="row g-3">
              <div className="col-md-4">
                <label>Taluka ID:</label>
                <input
                  type="number"
                  className="form-control"
                  value={talukaId}
                  onChange={(e) => setTalukaId(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label>City Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4 align-self-end">
                <button type="submit" className="btn btn-success w-100">Add City</button>
              </div>
            </form>
          </div>
        </div>

        {/* 🔍 Search City */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-warning text-dark">🔍 Search City by ID & Taluka ID</div>
          <div className="card-body">
            <form onSubmit={searchCity} className="row g-3">
              <div className="col-md-3">
                <label>City ID:</label>
                <input
                  type="number"
                  className="form-control"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label>Taluka ID:</label>
                <input
                  type="number"
                  className="form-control"
                  value={searchTalukaId}
                  onChange={(e) => setSearchTalukaId(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3 align-self-end">
                <button type="submit" className="btn btn-primary w-100">Search</button>
              </div>
            </form>
          </div>
        </div>

        {/* 📌 Search Result */}
        {searchResult && (
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-info text-white">📌 Search Result</div>
            <div className="card-body">
              <form
                className="row g-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateCity(searchResult.id, searchResult.taluka_id, searchResult.name);
                }}
              >
                <input type="hidden" value={searchResult.id} />
                <div className="col-md-4">
                  <label>Taluka ID:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={searchResult.taluka_id}
                    onChange={(e) => setSearchResult({ ...searchResult, taluka_id: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label>City Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={searchResult.name}
                    onChange={(e) => setSearchResult({ ...searchResult, name: e.target.value })}
                  />
                </div>
                <div className="col-md-4 align-self-end">
                  <button type="submit" className="btn btn-warning">✏️ Update</button>
                  <button type="button" className="btn btn-danger ms-2" onClick={() => deleteCity(searchResult.id)}>🗑️ Delete</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 📋 All Cities */}
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white">📃 All Cities</div>
          <div className="card-body table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Taluka ID</th>
                  <th>City Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cities.length > 0 ? (
                  cities.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={row.taluka_id}
                          onChange={(e) =>
                            setCities(cities.map((c) => c.id === row.id ? { ...c, taluka_id: e.target.value } : c))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={row.name}
                          onChange={(e) =>
                            setCities(cities.map((c) => c.id === row.id ? { ...c, name: e.target.value } : c))
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => updateCity(row.id, row.taluka_id, row.name)}
                        >
                          ✏️ Update
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteCity(row.id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center">No cities found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Styles
const sidebarStyle = {
  width: "250px",
  backgroundColor: "#343a40",
  color: "white",
  height: "100vh",
  position: "fixed",
  padding: "20px 10px",
};

const linkStyle = {
  display: "block",
  padding: "10px 15px",
  marginBottom: "10px",
  color: "white",
  textDecoration: "none",
  backgroundColor: "#495057",
  borderRadius: "5px",
  fontSize: "16px",
};
