import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Subcast() {
  const API_URL = "http://localhost/Major_api/Subcast.php";

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

  const [motherTongues, setMotherTongues] = useState([]);
  const [subCastes, setSubCastes] = useState([]);
  const [newMotherTongue, setNewMotherTongue] = useState("");
  const [newSubCaste, setNewSubCaste] = useState("");
  const [editMotherTongue, setEditMotherTongue] = useState(null);
  const [editSubCaste, setEditSubCaste] = useState(null);

  // ✅ Data fetch
  const fetchData = async () => {
    try {
      const mtRes = await axios.get(`${API_URL}?getMotherTongues=1`);
      setMotherTongues(Array.isArray(mtRes.data) ? mtRes.data : []);

      const scRes = await axios.get(`${API_URL}?getSubCastes=1`);
      setSubCastes(Array.isArray(scRes.data) ? scRes.data : []);
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ CRUD
  const handleAddMotherTongue = async () => {
    if (!newMotherTongue.trim()) return;
    await axios.post(`${API_URL}?addMotherTongue=1`, { name: newMotherTongue });
    setNewMotherTongue("");
    fetchData();
  };

  const handleAddSubCaste = async () => {
    if (!newSubCaste.trim()) return;
    await axios.post(`${API_URL}?addSubCaste=1`, { name: newSubCaste });
    setNewSubCaste("");
    fetchData();
  };

  const handleDeleteMotherTongue = async (id) => {
    if (window.confirm("❗ Delete this Mother Tongue?")) {
      await axios.post(`${API_URL}?deleteMotherTongue=1`, { id });
      fetchData();
    }
  };

  const handleDeleteSubCaste = async (id) => {
    if (window.confirm("❗ Delete this Sub Caste?")) {
      await axios.post(`${API_URL}?deleteSubCaste=1`, { id });
      fetchData();
    }
  };

  const handleUpdateMotherTongue = async (id) => {
    if (!editMotherTongue.name.trim()) return;
    await axios.post(`${API_URL}?updateMotherTongue=1`, { id, name: editMotherTongue.name });
    setEditMotherTongue(null);
    fetchData();
  };

  const handleUpdateSubCaste = async (id) => {
    if (!editSubCaste.name.trim()) return;
    await axios.post(`${API_URL}?updateSubCaste=1`, { id, name: editSubCaste.name });
    setEditSubCaste(null);
    fetchData();
  };

  return (
    <div className="container-fluid">
      {/* ✅ Sidebar Styling */}
      <style>
        {`
          .sidebar {
            background-color: #343a40;
            min-height: 100vh;
            padding: 15px;
          }
          .sidebar h5 {
            color: #fff;
            margin-bottom: 15px;
            font-weight: bold;
            font-size: 18px;
          }
          .sidebar-link {
            display: block;
            padding: 10px 12px;
            color: #ddd;
            text-decoration: none;
            font-size: 14px;
            transition: 0.3s;
            border-radius: 6px;
          }
          .sidebar-link:hover {
            background-color: #495057;
            color: #fff;
            padding-left: 18px;
          }
          .content-area {
            padding: 20px;
          }
        `}
      </style>

      <div className="row">
        {/* ✅ Slim Sidebar (कमी रुंदी) */}
        <div className="col-12 col-md-2 sidebar">
          <h5>📋 Menu</h5>
          {sidebarItems.map((item, index) => (
            <a key={index} href={item.link} className="sidebar-link">
              {item.title}
            </a>
          ))}
        </div>

        {/* ✅ Main Content - जास्त जागा */}
        <div className="col-12 col-md-10 content-area">
          <h2 className="text-center fw-bold mb-4">⚙ Manage Master Data</h2>

          <div className="row">
            {/* ✅ Mother Tongue Section */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm p-3 mb-4">
                <h4 className="fw-bold mb-3">Mother Tongue</h4>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Mother Tongue"
                    value={newMotherTongue}
                    onChange={(e) => setNewMotherTongue(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleAddMotherTongue}>
                    ➕ Add
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {motherTongues.length > 0 ? (
                        motherTongues.map((mt) => (
                          <tr key={mt.id}>
                            <td>{mt.id}</td>
                            <td>
                              {editMotherTongue?.id === mt.id ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={editMotherTongue.name}
                                  onChange={(e) =>
                                    setEditMotherTongue({ ...editMotherTongue, name: e.target.value })
                                  }
                                />
                              ) : (
                                mt.name
                              )}
                            </td>
                            <td>
                              {editMotherTongue?.id === mt.id ? (
                                <>
                                  <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={() => handleUpdateMotherTongue(mt.id)}
                                  >
                                    ✅ Save
                                  </button>
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setEditMotherTongue(null)}
                                  >
                                    ❌ Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => setEditMotherTongue(mt)}
                                  >
                                    ✏ Edit
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteMotherTongue(mt.id)}
                                  >
                                    🗑 Delete
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            ❌ No Mother Tongues Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ✅ Sub Caste Section */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm p-3 mb-4">
                <h4 className="fw-bold mb-3">Sub Caste</h4>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Sub Caste"
                    value={newSubCaste}
                    onChange={(e) => setNewSubCaste(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleAddSubCaste}>
                    ➕ Add
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subCastes.length > 0 ? (
                        subCastes.map((sc) => (
                          <tr key={sc.id}>
                            <td>{sc.id}</td>
                            <td>
                              {editSubCaste?.id === sc.id ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={editSubCaste.name}
                                  onChange={(e) =>
                                    setEditSubCaste({ ...editSubCaste, name: e.target.value })
                                  }
                                />
                              ) : (
                                sc.name
                              )}
                            </td>
                            <td>
                              {editSubCaste?.id === sc.id ? (
                                <>
                                  <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={() => handleUpdateSubCaste(sc.id)}
                                  >
                                    ✅ Save
                                  </button>
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setEditSubCaste(null)}
                                  >
                                    ❌ Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => setEditSubCaste(sc)}
                                  >
                                    ✏ Edit
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteSubCaste(sc.id)}
                                  >
                                    🗑 Delete
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            ❌ No Sub Castes Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
