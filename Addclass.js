import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Addclass() {
  const API_URL = "http://localhost/Major_api/Addclass.php";

  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState([]);
  const [editId, setEditId] = useState(null);

  const sidebarItems = [
    { title: "Add Students", link: "/studinfo" },
    { title: "Update Students", link: "/update" },
    { title: "Leaving Certificate", link: "/certificate" },
    { title: "Student Fees", link: "/fee" },
    { title: "Pending Fees", link: "/pendingfee" },
    { title: "Student Enrollment", link: "/enrollment" },
    { title: "Attendance", link: "/attendance" },
    { title: "Add City", link: "/city" },
    { title: "Dashboard", link: "/home" },
    { title: "Add Class", link: "/addclass" }
  ];

  // Fetch all classes
  const fetchClasses = () => {
    axios
      .get(API_URL)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setClasses(res.data);
        } else {
          setClasses([]);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Add / Update Class
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("class_name", className);
    if (editId) {
      formData.append("id", editId);
      formData.append("action", "update");
    } else {
      formData.append("action", "add");
    }

    axios
      .post(API_URL, formData)
      .then(() => {
        setClassName("");
        setEditId(null);
        fetchClasses();
      })
      .catch((err) => console.error(err));
  };

  // Edit Class
  const handleEdit = (id, name) => {
    setEditId(id);
    setClassName(name);
  };

  // Delete Class
  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("action", "delete");

    axios
      .post(API_URL, formData)
      .then(() => fetchClasses())
      .catch((err) => console.error(err));
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div
        style={{
          backgroundColor: "#212529",
          color: "white",
          padding: "15px",
          width: "220px",
          minHeight: "100vh",
        }}
      >
        <h5 className="text-center mb-4">School Menu</h5>
        <ul className="list-unstyled">
          {sidebarItems.map((item, index) => (
            <li key={index} className="mb-2">
              <a
                href={item.link}
                style={{
                  color: "white",
                  textDecoration: "none",
                  display: "block",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#495057";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="container mt-4">
        <h3 className="mb-3">{editId ? "Update Class" : "Add Class"}</h3>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-2">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Class Name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary w-100">
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Class Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(classes) &&
                classes.map((cls) => (
                  <tr key={cls.id}>
                    <td>{cls.id}</td>
                    <td>{cls.class_name}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(cls.id, cls.class_name)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(cls.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
