// src/pages/AttendEventForm.js
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./attendeventform.css";
import "react-toastify/dist/ReactToastify.css";

const AttendEventForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001"; // Fallback to localhost for local development
  // the variables and setter for the attend event form
  const [attendeesEmail, setAttendeesEmail] = useState([]); //store a list of email attendees
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [errors, setErrors] = useState({}); // variable to store the error when users to do not all the required fields
  const [errorMessage, setErrorMessage] = useState(""); // variable to set the error message when a user registers twice for the same event
  const [success, setSuccess] = useState(false); // initiate success variable message with "false" state

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/${parseInt(eventId)}/attendees`);
        console.log(response.data);
        setAttendeesEmail(
          response.data.map((attendee) => attendee.attendee_email)
        );
      } catch (error) {
        console.error("Error fetching attendee:", error);
      }
    };
    fetchAttendees();
  }, [API_URL]);

  const validateForm = () => {
    const newErrors = {};
    if (!firstNameInput.trim()) newErrors.firstName = "First name is required"; // if the first name input field is empty
    if (!lastNameInput.trim().toLocaleUpperCase())
      newErrors.lastName = "Last name is required";
    if (!emailInput.trim() || !/\S+@\S+\.\S+/.test(emailInput))
      newErrors.email = "Valid email is required";
    if (!phoneNumberInput.trim() || phoneNumberInput.length < 10)
      newErrors.phoneNumber = "Phone number must be at least 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page to reload
    if (!validateForm()) {
      return;
    }
    try {
      // add an attendee to the database send the input values to the backend
      const createANewAttendee = await axios.post(API_URL, {
        firstName: firstNameInput,
        lastName: lastNameInput,
        email: emailInput,
        phoneNumber: phoneNumberInput,
      });
      console.log("create attendee:", createANewAttendee)
      if (createANewAttendee.status === 201) {
        //if the form is sent with success
        setSuccess(true);

        console.log(
          "You registered successfully to the event",
          createANewAttendee.data
        );
        console.log("sucess state:", success)
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
      console.log(createANewAttendee.data);
    } catch (error) {
      console.error("Error registering attendee to the event", error);
    }
  };

  console.log("success:", success)
  return (
    <Container className="form-container">
      <h2>Register</h2>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          Registration successful to the event!
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="col-md-5 mx-auto">
        <InputGroup className="mb-3">
          {/* Input first name */}
          <InputGroup.Text id="basic-addon1">First name</InputGroup.Text>
          <Form.Control
            aria-label="firstName"
            aria-describedby="basic-addon1"
            name="firstName"
            type="text"
            value={firstNameInput}
            onChange={(e) => {
              setFirstNameInput(e.target.value);
            }}
          />
        </InputGroup>
        {errors.firstName && <p className="text-danger">{errors.firstName}</p>}

        {/* Input last name */}
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Last name</InputGroup.Text>
          <Form.Control
            aria-label="lastName"
            aria-describedby="basic-addon1"
            name="lastName"
            type="text"
            value={lastNameInput}
            onChange={(e) => {
              setLastNameInput(e.target.value);
            }}
          />
        </InputGroup>
        {errors.lastName && <p className="text-danger">{errors.lastName}</p>}

        {/* Input email */}
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
          <Form.Control
            aria-label="email"
            aria-describedby="basic-addon1"
            name="email"
            type="email"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
            }}
          />
        </InputGroup>
        {errors.email && <p className="text-danger">{errors.email}</p>}

        {/* Input Phone number */}
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Phone number</InputGroup.Text>
          <Form.Control
            aria-label="phoneNumber"
            aria-describedby="basic-addon1"
            name="phoneNumber"
            type="number"
            value={phoneNumberInput}
            onChange={(e) => {
              setPhoneNumberInput(e.target.value);
            }}
          />
        </InputGroup>
        {errors.phoneNumber && (
          <p className="text-danger">{errors.phoneNumber}</p>
        )}

        <Button variant="primary" type="submit">
          Attend event
        </Button>
      </Form>
    </Container>
  );
};

export default AttendEventForm;
