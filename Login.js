import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ Fixed credentials
    if (username === "admin" && password === "shree@1960") {
      setMessage("✅ Login Successful!");
      setTimeout(() => {
        navigate("/home"); // ✅ Redirect to Home page
      }, 1000);
    } else {
      setMessage("❌ Incorrect Username or Password.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundImage: "url('/img/17.jpg')", // ✅ Background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* 🔲 Dark Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.4)", // ✅ 40% dark overlay
          zIndex: 1,
        }}
      ></div>

      {/* ✅ Login Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 30px rgba(0, 0, 0, 0.4)",
          textAlign: "center",
          color: "#fff",
          zIndex: 2, // ✅ make sure card stays above overlay
        }}
      >
        <h1 style={{ marginBottom: "25px", fontWeight: "700" }}> Login</h1>

        {/* Username Input */}
        <div style={{ position: "relative", margin: "20px 0" }}>
          <input
            type="text"
            placeholder="👤 Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
          <i className="bx bxs-user" style={iconStyle}></i>
        </div>

        {/* Password Input */}
        <div style={{ position: "relative", margin: "20px 0" }}>
          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <i className="bx bxs-lock-alt" style={iconStyle}></i>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            background:
              "linear-gradient(45deg, #ff512f, #dd2476, #ff512f)",
            backgroundSize: "300% 300%",
            animation: "buttonGradient 5s ease infinite",
            color: "#fff",
            fontWeight: "700",
            fontSize: "16px",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            transition: "0.3s",
            boxShadow: "0 4px 20px rgba(255, 0, 150, 0.5)",
          }}
          onMouseOver={(e) =>
            (e.target.style.boxShadow = "0 6px 30px rgba(255, 0, 150, 0.8)")
          }
          onMouseOut={(e) =>
            (e.target.style.boxShadow = "0 4px 20px rgba(255, 0, 150, 0.5)")
          }
        >
           Login Now
        </button>

        {/* Message */}
        {message && (
          <div
            style={{
              marginTop: "15px",
              fontSize: "14px",
              color: message.includes("Incorrect") ? "#ff4d4d" : "#00ff99",
              fontWeight: "bold",
            }}
          >
            {message}
          </div>
        )}
      </div>

      {/* ✅ Keyframe Animations */}
      <style>
        {`
          @keyframes buttonGradient {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}
      </style>
    </div>
  );
}

/* ✅ Input & Icon Styling */
const inputStyle = {
  width: "100%",
  padding: "12px 50px 12px 15px",
  border: "none",
  borderRadius: "50px",
  background: "rgba(255, 255, 255, 0.2)",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
  transition: "0.3s",
};

const iconStyle = {
  position: "absolute",
  right: "18px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "20px",
  color: "#fff",
};
