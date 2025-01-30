// frontend/src/pages/CreateEventForm.js
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCalendarPlus } from "react-icons/fa";
import "./createeventform.css"

const CreateEventForm = () => {
  const API_URL = "http://localhost:3000/api/events"; // URL route where event are stored
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    // store the event informations into an object formData
    title: "",
    description: "",
    category: "",
    location: "",
    dateTime: "",
  });
  const [errors, setErrors] = useState({}); // initiate an error message variable
  const [success, setSuccess] = useState(false); // initiate a success message variable

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // update the formData with the new event
  };
 
  const validate = () => { // Function to store errors in an array
    const newErrors = {}; // store errors in newErrors object
    if (!formData.title) newErrors.title = "Title is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.dateTime) newErrors.dateTime = "Date and time are required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        eventTitle: formData.title,
        eventDescription: formData.description,
        eventCategory: formData.category,
        eventLocation: formData.location,
        eventDatetime: formData.dateTime,
      });

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          title: "",
          description: "",
          category: "",
          location: "",
          dateTime: "",
        });
        setTimeout(() => navigate("/home"), 2000); // Redirect 2 secondes after success
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="col-md-6 mx-auto mt-5">
      <h2 className="text-center mb-4">
        Create a new event by filling the form
      </h2>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          Event created successfully!
        </Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate>
        {/* Title */}
        <InputGroup className="mb-3">
          <InputGroup.Text>Title</InputGroup.Text>
          <Form.Control
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the event title"
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title}
          </Form.Control.Feedback>
        </InputGroup>

        {/* Description */}
        <InputGroup className="mb-3">
          <InputGroup.Text>Description</InputGroup.Text>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a brief description of the event"
          />
        </InputGroup>

        {/* Category */}
        <InputGroup className="mb-3">
          <InputGroup.Text>Category</InputGroup.Text>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            isInvalid={!!errors.category}
          >
            <option value="">Choose a category</option>
            <option value="Cooking">Cooking</option>
            <option value="Farm work">Farm work</option>
            <option value="Hospital tour">Hospital tour</option>
            <option value="Barbecue">Barbecue</option>
            <option value="Packaging food">Packaging food</option>
            <option value="Blood donation">Blood donation</option>
            <option value="Rebuilding kibbutzim">Rebuilding kibbutzim</option>
            <option value="Online volunteering">Online volunteering</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.category}
          </Form.Control.Feedback>
        </InputGroup>

        {/* Location */}
        <InputGroup className="mb-3">
          <InputGroup.Text>Location</InputGroup.Text>
          <Form.Control
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter the event location"
          />
        </InputGroup>

        {/* Date & Time */}
        <InputGroup className="mb-3">
          <InputGroup.Text>Date & Time</InputGroup.Text>
          <Form.Control
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            isInvalid={!!errors.dateTime}
          />
          <Form.Control.Feedback type="invalid">
            {errors.dateTime}
          </Form.Control.Feedback>
        </InputGroup>

        {/* Submit Button */}
        <div className="text-center">
          <Button variant="primary" type="submit" className="custom-button px-5 d-flex align-items-center justify-content-center">
          <FaCalendarPlus className="me-2" />

            Create event
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateEventForm;
