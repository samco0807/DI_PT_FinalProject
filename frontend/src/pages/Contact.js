import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phoneNumber: "",
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour gérer l'envoi du formulaire
  };

  return (
    <Container>
      <h2>Contact us</h2>
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
            value={formData.lastName}
            onChange={handleChange}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Object</InputGroup.Text>
          <Form.Control
            aria-label="object"
            aria-describedby="basic-addon1"
            name="object"
            type="text"
            value={formData.object}
            onChange={handleChange}
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Text>Message</InputGroup.Text>
          <Form.Control
            as="textarea"
            aria-label="With textarea"
            name="Message"
            value={formData.message}
          />
        </InputGroup>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Add attachment</Form.Label>
          <Form.Control type="file" />
        </Form.Group>

        {/* Captcha Checkbox (Optionnel) */}
        <Form.Group controlId="formCaptcha">
          <Form.Check type="checkbox" label="I'm not a robot" required />
        </Form.Group>

        

        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
    </Container>
  );
};

export default ContactForm;
