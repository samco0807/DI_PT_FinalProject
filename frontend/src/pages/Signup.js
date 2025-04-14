// root/frontend/src/pages/pages/SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";

import { useAuth } from "../context/AuthContext";
import axios from "axios";

const SignUpForm = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001"; // Fallback to localhost for local development
  const navigate = useNavigate();

  const { handleLogin } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [error, setError] = useState(null);
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
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/register`, formData, {
        withCredentials: true,
      });
      const { token, role } = res.data;
      handleLogin(token, role);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
      });
      setTimeout(() => navigate("/home"), 1000); // Redirect 2 secondes after success
    } catch (error) {
      setError(error.response?.data?.message || "registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2>Register</h2>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          You registered successfully!
        </Alert>
      )}
      {error && <Alert variant="danger">Registration failed</Alert>}

      <Form onSubmit={handleSubmit} className="col-md-5 mx-auto">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">First name</InputGroup.Text>
          <Form.Control
            aria-label="firstName"
            aria-describedby="basic-addon1"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Last name</InputGroup.Text>
          <Form.Control
            aria-label="lastName"
            aria-describedby="basic-addon1"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
          <Form.Control
            aria-label="email"
            aria-describedby="basic-addon1"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
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
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Confirm Password</InputGroup.Text>
          <Form.Control
            aria-label="password"
            aria-describedby="basic-addon1"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Phone</InputGroup.Text>
          <Form.Control
            aria-label="phoneNumber"
            aria-describedby="basic-addon1"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </InputGroup>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Signing up ..." : "Sign up"}
        </Button>
      </Form>
    </Container>
  );
};

export default SignUpForm;
