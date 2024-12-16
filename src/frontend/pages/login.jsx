import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
/*import "./pages.css";*/

const Login = () => {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending form data:", formData);
    try {
      const response = await axios.post(
        "/api/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log("User logged:", response.data);
localStorage.setItem("token", response.data?.token);
      Navigate('/');
    } catch (error) {
      console.error("Error creating user:", error)
      setStatus(error.message)
    }
  };

  return (
    <form onSubmit={handleSubmit}
      className="widthFull">
      <h1>Login</h1>
      <p>{status}</p>
      <label>Enter Email</label>
      <div className= "input-container login-input">
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
      <div className= "input-container login-input">
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
      <button type="submit" className="Submit">Login</button>
      <p>New Here? <Link to="/SignUp">Sign Up</Link></p>
    </form>
    )
};
        
        
                     
export default Login;