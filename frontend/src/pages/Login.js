// root/frontend/src/pages/pages/login.js
// import React features
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import context
import { useAuth } from "../context/AuthContext.js";
// import Bootstrap features
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
// import Context
import axios from "axios";

const LoginForm = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001"; // Fallback to localhost for local development
  const navigate = useNavigate();

  const { handleLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(null);

  const [success, setSuccess] = useState(false); // initiate a success message variable

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/login`, formData, {
        withCredentials: true,
      });
      const { token, role, userId } = res.data;
      handleLogin(token, role, userId);
      console.log(handleLogin);

      setSuccess(true);
      setFormData({
        email: "",
        password: "",
        rememberMe: false,
      });
      setTimeout(() => navigate("/home"), 1000); // Redirect 2 secondes after success
    } catch (error) {
      console.error("Login failed: ", error);
      setError("Invalid Credential");
      setLoading(false);
    }
  };

  return (
    <Container className="col-md-4 mx-auto">
      <h2>Log in</h2>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          Logged in successfully!
        </Alert>
      )}
      {error && <Alert variant="danger">Log in failed</Alert>}

      <Form onSubmit={handleSubmit}>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
          <Form.Control
            aria-label="email"
            aria-describedby="basic-addon1"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
          <Form.Control
            aria-label="password"
            aria-describedby="basic-addon1"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <Form.Group controlId="formRememberMe">
          <Form.Check
            type="checkbox"
            name="rememberMe"
            label="Remember me"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Log in
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
