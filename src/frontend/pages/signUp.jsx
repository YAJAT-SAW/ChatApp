import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
/*import "./pages.css";*/

const SignUp = () => {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
    const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name == "password"){
validatePassword(e.target.value);
    }
    else if (e.target.name == "email"){
validateEmail(e.target.value);
    }
  };
    const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending form data:", formData);
    try {
      const response = await axios.post(
        "/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log("User created:", response.data);
      Navigate('/Login');
    } catch (error) {
      console.error("Error creating user:", error)
      setStatus('name or email may not be available')
    }
  };

  return (
    <form onSubmit={handleSubmit}
      className="widthFull">
      <h1>SignUp</h1>
      <p>{status}</p>
      <label>Create a Username</label>
      <div className="input-container login-input">
        <i className="bi bi-person"></i>
        <input
          type="text"
          name="name"
          placeholder="name"
          className="NoBorder InputLogin"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <label>Enter Email</label>
      <div className={emailError? "input-container login-input invalid" : "input-container login-input"}>
        <i className="bi bi-envelope"></i>
        <input
          type="email"
          name="email"
          placeholder="email"
          className="NoBorder InputLogin"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <label>Create a Password</label>
      <div className={passwordError? "input-container login-input invalid" : "input-container login-input"}>
        <i className="bi bi-lock"></i>
        <input
          type="password"
          name="password"
        placeholder="password"
          className="NoBorder InputLogin"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="Submit">SignUp</button>
      <p>Already have an account? <Link to="/Login">Login</Link></p>
    </form>
  );
};

export default SignUp;