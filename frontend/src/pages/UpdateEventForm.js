// frontend/src/pages/UpdateEventForm.js
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateEventForm = () => {
  const { eventId } = useParams();
  console.log(eventId);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL ||`http://localhost:3000/events/${eventId}`;
  const [eventUpdatedTitleInput, setEventUpdatedTitleInput] = useState("");
  const [eventUpdatedDescriptionInput, setEventUpdatedDescriptionInput] =
    useState("");
  const [eventUpdatedCategoryInput, setEventUpdatedCategoryInput] =
    useState("");
  const [eventUpdatedLocationInput, setEventUpdatedLocationInput] =
    useState("");
  const [eventUpdatedDateTimeInput, setEventUpdatedDateTimeInput] =
    useState("");
  const [
    eventUpdatedNumberOfAttendeesInput,
    setEventUpdatedNumberOfAttendeesInput,
  ] = useState("");

  // While the page is rendering
  useEffect(() => {
    // Get the event
    const getEvent = async () => {
      try {
        // fetch the data from the event id url
        const response = await axios.get(API_URL);
        const event = response.data;
        console.log(event);

        // function that adjusts the schedule according to the time zone
        const toLocalDatetimeString = (dateString) => {
          const date = new Date(dateString);
          const offset = date.getTimezoneOffset(); // Décalage en minutes
          const localDate = new Date(date.getTime() - offset * 60000); // Ajuster au fuseau local
          return localDate.toISOString().slice(0, 16);
        };

        setEventUpdatedTitleInput(event.event_title);
        setEventUpdatedDescriptionInput(event.event_description);
        setEventUpdatedCategoryInput(event.event_category);
        setEventUpdatedLocationInput(event.event_location);
        setEventUpdatedDateTimeInput(
          toLocalDatetimeString(event.event_datetime)
        );

        setEventUpdatedNumberOfAttendeesInput(event.event_attendees_number);
      } catch (error) {
        console.error("Error fetching the event", error);
      }
    };
    getEvent();
  }, [API_URL]);

  const handleUpdateEventSubmit = async (e) => {
    e.preventDefault();
    console.log("Trying to update event with title:", eventUpdatedTitleInput);
    if (!eventUpdatedTitleInput) {
      console.error("Event title is required.");
      return;
    }
    console.log("sending data:", {
      eventTitle: eventUpdatedTitleInput,
      eventDescription: eventUpdatedDescriptionInput,
      eventCategory: eventUpdatedCategoryInput,
      eventLocation: eventUpdatedLocationInput,
      eventDatetime: eventUpdatedDateTimeInput,
      eventAttendeesNumber: eventUpdatedNumberOfAttendeesInput,
    });
    try {
      // send the updated input in the url
      const response = await axios.put(API_URL, {
        eventTitle: eventUpdatedTitleInput,
        eventDescription: eventUpdatedDescriptionInput,
        eventCategory: eventUpdatedCategoryInput,
        eventLocation: eventUpdatedLocationInput,
        eventDatetime: eventUpdatedDateTimeInput,
        eventAttendeesNumber: eventUpdatedNumberOfAttendeesInput,
      });
      // setEventTitleInput((prevEvents) => [...prevEvents, response.data]);
      console.log(
        "response:",
        eventUpdatedTitleInput,
        eventUpdatedDescriptionInput,
        eventUpdatedCategoryInput,
        eventUpdatedLocationInput,
        eventUpdatedDateTimeInput,
        eventUpdatedNumberOfAttendeesInput
      );
      console.log("Create event response:", response);
      if (response.status === 200) {
        console.log("Event updated successfully!");
        navigate("/home"); //redirect to home after update
      } else {
        console.error("Failed to update event", response.data);
      }
    } catch (error) {
      console.error("Error trying to update the event in the DOM", error);
    }
  };

  return (
    <div>
      {/* form with prefilled inputs */}
      <Form onSubmit={handleUpdateEventSubmit} className="col-md-4 mx-auto">
        <InputGroup className="mb-3">
          <InputGroup.Text
            id="inputGroup-sizing-default"
            aria-placeholder="Enter new Title"
            aria-required
          >
            Title
          </InputGroup.Text>
          <Form.Control
            value={eventUpdatedTitleInput}
            onChange={(e) => setEventUpdatedTitleInput(e.target.value)}
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Description
          </InputGroup.Text>
          <Form.Control
            value={eventUpdatedDescriptionInput}
            onChange={(e) => setEventUpdatedDescriptionInput(e.target.value)}
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Category
          </InputGroup.Text>
          <Form.Select
            aria-label="Default select example"
            value={eventUpdatedCategoryInput}
            onChange={(e) => setEventUpdatedCategoryInput(e.target.value)}
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
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Location
          </InputGroup.Text>
          <Form.Control
            value={eventUpdatedLocationInput}
            onChange={(e) => setEventUpdatedLocationInput(e.target.value)}
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Date & time
            <Form.Group controlId="formDateTime">
              {" "}
              <Form.Control
                type="datetime-local"
                value={eventUpdatedDateTimeInput}
                onChange={(e) => setEventUpdatedDateTimeInput(e.target.value)}
              />{" "}
            </Form.Group>
          </InputGroup.Text>
        </InputGroup>
        <h4>Participants: {eventUpdatedNumberOfAttendeesInput} </h4>
        <div>
          <Button variant="primary" type="submit">
            Save event
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateEventForm;
