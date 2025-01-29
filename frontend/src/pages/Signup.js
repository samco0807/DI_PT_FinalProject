import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    category: "",
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour gérer l'inscription
  };

  return (
    <Container>
      <h2>Register</h2>
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
          <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
          <Form.Control
            aria-label="username"
            aria-describedby="basic-addon1"
            name="username"
            type="text"
            value={formData.username}
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
            type="text"
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
            type="text"
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
            type="number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </InputGroup>

        {/* Radio select for particpants whether volunteer or Organiser */}
        <fieldset>
          <Form.Group as={Row} className="mb-3">
            <Form.Label as="legend" column sm={2}>
              I am
            </Form.Label>
            <Col sm={10}>
              <Form.Check
              inline
                type="radio"
                label="Volunteer"
                name="formHorizontalRadios"
                id="formHorizontalRadios1"
              />
              <Form.Check
              inline
                type="radio"
                label="Organiser"
                name="Organiser"
                id="organiser"
              />
            </Col>
          </Form.Group>
        </fieldset>

        <Form.Group controlId="formTerms">
          <Form.Check
          inline
            type="checkbox"
            name="termsAccepted"
            label="I accept terms and conditions"
            checked={formData.termsAccepted}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign up
        </Button>
      </Form>
    </Container>
  );
};

export default SignUpForm;
