import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost/Major_api/dashboard_stats.php")
      .then((res) => {
        if (res.data.success) {
          setStats(res.data);
          setActivities(res.data.activities || []);
        }
      })
      .catch((err) => console.error("❌ Error fetching stats:", err));
  }, []);

  const statCards = [
    { label: "Total Students", value: stats.total_students, color: "primary" },
    { label: "Total Bonafide", value: stats.total_bonafide, color: "success" },
    { label: "Total Certificates", value: stats.total_certificates, color: "info" },
    { label: "Fees Collected", value: `₹ ${stats.total_fee || 0}`, color: "warning" },
    { label: "Pending Fees", value: `₹ ${stats.total_pending || 0}`, color: "danger" },
  ];

  const cards = [
    { title: "Add Students", link: "/studinfo" },
    { title: "Bonafide", link: "/download" },
    { title: "Leaving Certificate", link: "/certificate" },
    { title: "Student Fees", link: "/fee" },
    { title: "Pending Fees", link: "/pendingfee" },
    { title: "Student Enrollment", link: "/enrollment" },
    { title: "Attendance", link: "/attendance" },
    { title: "Add Talukha", link: "/talukha" },
    { title: "Add City", link: "/city" },
    { title: "Report", link: "/report" },
    { title: "Subcast", link: "/Subcast" },
    { title: "Addclass", link: "/Addclass" },
  ];

  return (
    <div>
      {/* ✅ Toggle Button (Mobile) */}
      <button
        className="btn btn-primary toggle-btn"
        onClick={() => document.getElementById("sidebar").classList.toggle("hide")}
        style={{
          position: "fixed",
          top: "15px",
          left: "15px",
          zIndex: 1100,
          display: window.innerWidth < 768 ? "block" : "none",
        }}
      >
        <i className="bi bi-list"></i>
      </button>

      {/* ✅ Sidebar */}
      <div
        className="sidebar bg-dark text-white p-3"
        id="sidebar"
        style={{
          width: "250px",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          transition: "all 0.3s ease",
          zIndex: 1000,
        }}
      >
        <h4 className="text-center mb-4">🎓 SPKV School</h4>
        <SidebarLink to="/studinfo" icon="person-plus" label="Add Student" />
        <SidebarLink to="/update" icon="pencil-square" label="Update Student" />
        <SidebarLink to="/delete" icon="trash" label="Delete Students" />
        <SidebarLink to="/fee" icon="cash" label="Fee Management" />
        <SidebarLink to="/studfee" icon="cash-stack" label="Student Class" />
        <SidebarLink to="/certificate" icon="award" label="Leaving Certificate" />
        <SidebarLink to="/attendance" icon="calendar-check" label="Attendance" />
        <SidebarLink to="/catalog" icon="arrow-up-circle" label="Catalog" />
        <SidebarLink to="/allrecord" icon="graph-up" label="Student Record" />
        <SidebarLink to="/talukha" icon="geo-alt" label="Add Talukha" />
        <SidebarLink to="/city" icon="building" label="Add City" />
        <SidebarLink to="/Addclass" icon="building" label="Add Class" />
        <SidebarLink to="/home" icon="box-arrow-right" label="Logout" />
      </div>

      {/* ✅ Main Content */}
      <div className="content" style={{ marginLeft: "260px", padding: "20px" }}>
        <h2 className="mb-4">📊 Dashboard Overview</h2>

        {/* ✅ Stat Cards */}
        <div className="row mb-4">
          {statCards.map((stat, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className={`card shadow border-start border-${stat.color} border-5 p-3`}>
                <h6 className="text-muted">{stat.label}</h6>
                <h4 className={`text-${stat.color}`}>{stat.value}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Quick Navigation Cards */}
        <div className="row g-4">
          {cards.map((card, index) => (
            <div key={index} className="col-md-3 col-sm-6 col-12">
              <div
                className="card p-3"
                style={{
                  borderLeft: "5px solid #0d6efd",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <h5>{card.title}</h5>
                <Link to={card.link} className="btn btn-outline-primary btn-sm mt-2">
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Recent Activity */}
        <div className="card mt-5">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">📌 Recent Activities</h5>
          </div>
          <div className="card-body">
            {activities.length > 0 ? (
              <ul className="list-group list-group-flush">
                {activities.map((act, index) => (
                  <li key={index} className="list-group-item">
                    {act.activity_text}
                    <span className="text-muted float-end small">
                      {new Date(act.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted">No recent activities found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Sidebar Link Component
const SidebarLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="d-block py-2 px-3 mb-2"
    style={{
      color: "white",
      backgroundColor: "#495057",
      textDecoration: "none",
      borderRadius: "5px",
      transition: "0.3s",
      fontSize: "15px",
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#6c757d")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#495057")}
  >
    <i className={`bi bi-${icon}`}></i> {label}
  </Link>
);
