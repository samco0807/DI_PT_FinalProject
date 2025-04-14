// frontend/src/pages/HomePage.js
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { EventContext } from "../context/EventContext.js";
import { useAuth } from "../context/AuthContext.js";
// import bootstrap features
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "react-bootstrap/Badge";
import Collapse from "react-bootstrap/Collapse";
// import icons
import { BsFillTrash3Fill, BsCalendar2DateFill } from "react-icons/bs";
import {
  FaEdit,
  FaCheckCircle,
  FaUsers,
  FaMapMarkerAlt,
  FaTh,
  FaList,
  FaCalendarAlt,
} from "react-icons/fa";
import { RiTimeLine } from "react-icons/ri";
import { MdOutlineCategory } from "react-icons/md";

// import date format
import { format } from "date-fns";
import "./homepage.css";

const HomePage = () => {
  // initation of states and variables
  const { eventTable, setEventTable } = useContext(EventContext);
  const { userId, token, role, handleLogout } = useAuth();
  const location = useLocation();

  // for deployment:
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001"; // Fallback to localhost for local development
  // for local use:
  console.log("API_URL: ", API_URL);
  // const API_URL = "http://localhost:3000/events"; //  declare and initiate API variable to fetch events
  const navigate = useNavigate();
  // create an object to store the filters
  const [filters, setFilters] = useState({
    location: "",
    categories: [],
    date: "",
  });
  const [filteredEvents, setFilteredEvents] = useState([]); // store the filter events in a new array to iterate so that it can be displayed through iteration
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false); //state to control past events visibility
  // state to control the view
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("viewMode") || "card";
  }); // state to manage the active view and to change for calendar or list
  const [showOnlyMyEvents, setShowOnlyMyEvents] = useState(false);

  // Fetch events on mount
  useEffect(() => {
    // function to fetch and displays the events
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`); // fetch the event from the URL API
        console.log(response);

        setEventTable(response.data); // display events from the table
        setFilteredEvents(response.data); // display filtered events
        console.log(response.data);
      } catch (error) {
        console.error("Error displaying events");
      }
    };
    fetchEvents();
  }, [API_URL, setEventTable]);

  useEffect(() => {
    console.log(
      "HomePage filtering effect - Start. ShowOnlyMyEvents: ",
      showOnlyMyEvents,
      "userId: ",
      userId
    );
    let tempFiltered = [...eventTable]; // initialise filtered event using the events in the database

    if (filters.location) {
      // if the filter for location is not empty
      tempFiltered = tempFiltered.filter((event) =>
        event.event_location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      );
    }

    if (filters.categories && filters.categories.length > 0) {
      tempFiltered = tempFiltered.filter((event) =>
        filters.categories.includes(event.event_category.toLowerCase())
      );
    }

    if (filters.date) {
      tempFiltered = tempFiltered.filter(
        (event) => event.event_date === filters.date
      );
    }

    // Filter to show only the event from the current connected organizer account
    if (showOnlyMyEvents && userId) {
      tempFiltered = tempFiltered.filter((event) => {
        if (event.organizer_id === undefined || event.organizer_id === null) {
          console.warn(`Event ${event.event_id} has no organizer_id.`);
          return false;
        }
        const isMyEvent = String(event.organizer_id) === String(userId);

        return isMyEvent;
      });
    } else {
      console.log("HomePage Filtering Effect - 'My Events' filter NOT active");
    }

    setFilteredEvents(tempFiltered); // initialize the filtered events setter with the filtered data
  }, [filters, eventTable, showOnlyMyEvents, userId]);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "instant" });
      }
    }
  }, [location]);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode); // store the current view in local storage so that it stays while refreshing the page
  }, [viewMode]);

  // handle the checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      categories: checked
        ? [...prevFilters.categories, name.toLowerCase()]
        : prevFilters.categories.filter(
            (category) => category !== name.toLowerCase()
          ),
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const toggleDropDown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const deleteEvent = async (eventId) => {
    if (!eventId) {
      console.error("Event ID is undefined!");
      return;
    }
    const API_URL_EVENT = `${API_URL}/events/${eventId}`;
    console.log("Event ID:", eventId);
    console.log("API_URL_EVENT: ", API_URL_EVENT);
    try {
      await axios.delete(API_URL_EVENT);
      console.log("Deleted event ID:", eventId);
      setEventTable(eventTable.filter((event) => event.event_id !== eventId));
      console.log("Event deleted successfully from the Home");
    } catch (error) {
      console.error("Error trying to delete the event", error);
    }
  };

  // Function that compare the event date to the current date to apply different style
  const getEventStatus = (eventDateStr) => {
    if (!eventDateStr) {
      return "unknown";
    }
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const eventDate = new Date(eventDateStr + "T00:00:00");
      eventDate.setHours(0, 0, 0, 0);

      if (isNaN(eventDate.getTime())) {
        console.warn("Invalid date string encountered", eventDateStr);
        return "unknown";
      }

      if (eventDate.toDateString() === today.toDateString()) {
        return "today";
      } else if (eventDate < today) {
        return "past";
      } else {
        return "future";
      }
    } catch (error) {
      console.error("Error parsing data: ", eventDateStr, error);
      return "unknown";
    }
  };

  // --- Derived State: Split events into past and current/future ---
  const pastEvents = filteredEvents
    .filter((event) => getEventStatus(event.event_date) === "past")
    .sort(
      (a, b) =>
        new Date(b.event_date + "T00:00:00") -
        new Date(a.event_date + "T00:00:00")
    );

  const currentAndFutureEvents = filteredEvents
    .filter((event) => getEventStatus(event.event_date) !== "past")
    .sort(
      (a, b) =>
        new Date(b.event_date + "T00:00:00") -
        new Date(a.event_date + "T00:00:00")
    );

  // Function to navigate to the update event page
  const navigateToUpdateEventPage = (eventId) => {
    console.log(eventId);
    navigate(`/events/${eventId}/updateevent`);
  };

  // Function to navigate to the event attendance form page
  const navigateToAttendEventPage = (eventId) => {
    navigate(`/events/${eventId}/attendeventform`);
  };

  // Function to navigate to see the participants of an event
  const navigateToAttendeesEventPage = (eventId) => {
    navigate(`/events/${eventId}/attendees`);
  };

  // Rendering functions for reusability
  
  // Renders the common buttons for an event
  const renderEventButtons = (event) => {
    // first check if the event exist
    if (!event || typeof event.event_id === "undefined") {
      console.warn("renderEventButtons called with invalid event: ", event);
      return null;
    }
    // const eventId = event.event_id;

    // get the event status
    const status = getEventStatus(event.event_date);

    return (
      <div className="d-flex flex-wrap gap-2 mt-3">
        <Button
          variant="outline-primary"
          className="flex-grow-1 d-flex align-items-center justify-content-center"
          onClick={() => navigateToAttendeesEventPage(event.event_id)}
        >
          Participants
          <FaUsers size={16} className="ms-2" />
        </Button>

        {status !== "past" && (
          <>
            <Button
              variant="success"
              className="flex-grow-1 d-flex align-items-center"
              onClick={() => navigateToAttendEventPage(event.event_id)}
            >
              <FaCheckCircle size={16} className="me-1" /> Attend
            </Button>

            <Button
              variant="warning"
              className="flex-grow-1 d-flex align-items-center"
              onClick={() => navigateToUpdateEventPage(event.event_id)}
            >
              <FaEdit size={16} className="me-1" /> Edit
            </Button>
          </>
        )}

        <Button
          variant="danger"
          className="flex-grow-1 d-flex align-items-center"
          onClick={() => {
            console.log("Event object:", event);
            if (window.confirm("Are you sure to delete this event?")) {
              deleteEvent(event.event_id);
            }
          }}
        >
          <BsFillTrash3Fill size={16} className="me-1" /> Delete
        </Button>
      </div>
    );
  };

  // Renders a single event card
  const renderEventCard = (event) => {
    const status = getEventStatus(event.event_date);
    return (
      <Col
        key={event.event_id}
        xs={12}
        sm={6}
        md={6}
        lg={4}
        className="d-flex mb-4"
      >
        <Card
          className={`d-flex flex-column w-100 h-100 shadow-sm border-0 ${status}`}
          style={{
            backgroundColor: "var(--card-bg-color)",
            color: "var(--card-text-color)",
          }}
        >
          {/* Badge for participants */}
          <div className="position-absolute top-0 end-0 m-2">
            <Badge bg="info" className="fs-6">
              <FaUsers className="me-1" />
              {event.event_attendees_number}
            </Badge>
          </div>
          <Card.Body className="d-flex flex-column">
            <Card.Title className="fw-bold">{event.event_title}</Card.Title>

            <Card.Text>
              Organizer:
              <a
                href={`https://wa.me/${event.user_phonenumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ms-1"
                title={`Contact ${event.user_firstname} via WhatsApp`}
              >
                {" "}
                {event.user_firstname} {event.user_lastname}{" "}
              </a>{" "}
            </Card.Text>
            <Card.Text className="text-muted mb-2">
              <BsCalendar2DateFill className="me-1" />
              {format(new Date(event.event_date), "dd/MM/yyyy")} |{" "}
              <RiTimeLine className="me-1" />
              {event.event_time}
            </Card.Text>
            <Card.Text className="text-muted mb-2">
              <FaMapMarkerAlt className="me-1 text-danger" />
              {event.event_location} |{" "}
              <MdOutlineCategory className="me-1 text-warning" />
              {event.event_category}
            </Card.Text>
            <Card.Text className="event-description flex-grow-1 mb-3">
              {event.event_description}
            </Card.Text>

            {/* Button */}
            {renderEventButtons(event)}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  const renderEventListItem = (event) => {
    const status = getEventStatus(event.event_date);
    return (
      <li
        key={event.event_id}
        className={`list-group-item p-3 mb-3 border rounded shadow-sm ${status}`}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="fw-bold text-primary">{event.event_title}</h5>
            <p className="text-muted mb-1">
              <BsCalendar2DateFill className="me-1 text-secondary" />
              {format(new Date(event.event_date), "dd/MM/yyyy")}{" "}
              <RiTimeLine className="me-1 text-secondary" />
              {event.event_time}
            </p>
            <p className="text-muted mb-1">
              <FaMapMarkerAlt className="me-1 text-danger" />
              {event.event_location}
            </p>
            <p className="text-muted">
              <MdOutlineCategory className="me-1 text-warning" />
              {event.event_category}
            </p>

            <p className="text-muted">
              <a
                href={`https://wa.me/${event.user_phonenumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.user_firstname} {event.user_lastname}
              </a>
            </p>
          </div>
          <div>
            <Badge bg="info" className="fs-6">
              <FaUsers className="me-1" />
              {event.event_attendees_number}
            </Badge>
          </div>
        </div>

        <p className="text-secondary mt-3">{event.event_description}</p>

        {/* Button */}
        {renderEventButtons(event)}
      </li>
    );
  };

  return (
    <>
      <div className="mb-4">
        <h1>Welcome on Volunteers4Israel</h1>
        <p className="lead">
          Find, join, and organize volunteer activities across Israel. Together,
          we build a stronger community.
        </p>
      </div>

      {/* About us section */}
      <section className="about-us-section text-center py-4 py-md-5 mb-5">
        <div className="container">
          <h2 className="mb-4 fw-bold" style={{ fontWeight: "bold" }}>
            Who We Are
          </h2>
          <p
            className="lead text-muted mb-4 mx-auto"
            style={{ maxWidth: "800px" }}
          >
            At Volunteers4Israel, we believe in the power of volunteering to
            create meaningful change. Our mission is to connect volunteers and
            organizations across Israel to make an impact. Since 2024, we have
            been simplifying the process of finding and joining volunteer
            opportunities.
          </p>

          <Row className="row text-center my-4 my-5">
            <Col md={4} className="mb-3 mb-md-0">
              <h3 className="text-primary" style={{ fontWeight: "bold" }}>
                5,000+
              </h3>
              <p className="text-muted">Events organized in 2024</p>
            </Col>
            <Col className="col-md-4">
              <h3 className="text-primary" style={{ fontWeight: "bold" }}>
                150,000+
              </h3>
              <p className="text-muted">Hours of volunteering mobilized</p>
            </Col>
            <Col className="col-md-4">
              <h3 className="text-primary" style={{ fontWeight: "bold" }}>
                350+
              </h3>
              <p className="text-muted">
                Local & international organizations partnered
              </p>
            </Col>
          </Row>

          <div>
            <Button
              className="btn btn-primary btn-lg"
              onClick={() => {
                navigate("/aboutus");
              }}
            >
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>

      {/* FILTERS & VIEW SECTION */}
      <Row
        id="filters-section"
        className="g-3 mb-4 align-items-end col-lg-10 col-md-11 mx-auto justify-content-center"
      >
        {/* Filter control */}
        <Col xs={12} md={6} lg={3}>
          {/* Filter by location */}
          <Form.Control
            type="text"
            name="location"
            placeholder="Filter by location"
            value={filters.location}
            onChange={handleFilterChange}
            style={{ height: "40px" }}
            className="w-100 mb-2 mb-md-0"
          />
        </Col>

        {/* Dropdown to filter by category */}
        <Col xs={12} sm={6} md={4} lg={3}>
          <Dropdown
            show={dropdownOpen}
            onToggle={(isOpen) => setDropdownOpen(isOpen)}
            className="w-100 d-flex justify-content-between align-items-center text-start"
            autoClose="outside"
          >
            <Dropdown.Toggle
              variant="outline-secondary"
              id="dropdown-categories"
              className="w-100 d-flex justify-content-between align-items-center text-start"
              style={{
                height: "40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={toggleDropDown}
            >
              {filters.categories.length > 0
                ? `Categories (${filters.categories.length})`
                : "Filter by category"}
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              {" "}
              {/* Make menu full width of toggle */}
              {[
                "Cooking",
                "Farm work",
                "Hospital tour",
                "Barbecue",
                "Packaging food",
                "Blood donation",
                "Rebuilding kibbutzim",
                "Online volunteering",
              ].map((option, idx) => (
                <Dropdown.Item key={idx} className="px-2">
                  <Form.Check
                    type="checkbox"
                    id={`cat-check-${idx}`}
                    label={option}
                    name={option}
                    checked={filters.categories.includes(option.toLowerCase())}
                    onChange={handleCheckboxChange} // Direct onChange here
                  />
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        {/* Filter by date */}
        <Col xs={12} sm={6} md={4} lg={3}>
          <Form.Control
            type="text" // Start as text
            name="date"
            placeholder="Filter by date (YYYY-MM-DD)"
            value={filters.date}
            onFocus={(e) => {
              e.target.type = "date";
            }}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }} // Keep date type if value exists
            onChange={handleFilterChange}
            aria-label="Filter by date"
          />
        </Col>

        {/* Display active filters */}

        {filters.categories.length > 0 && (
          <Col xs={12} className="mt-2 text-center text-md-start">
            <span className="me-2 small text-muted">Active categories:</span>

            {filters.categories.map((category, idx) => (
              <Badge key={idx} pill bg="success" className="me-1 fw-normal">
                {category}{" "}
                <span
                  className="ms-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      categories: prevFilters.categories.filter(
                        (cat) => cat !== category
                      ),
                    }));
                  }}
                >
                  &times;
                </span>
              </Badge>
            ))}
          </Col>
        )}

        {/* Clear Filters Button */}
        <Col xs={12} lg="auto" className="mt-3 mt-lg-0">
          <Button
            variant="outline-secondary"
            onClick={() =>
              setFilters({ location: "", categories: [], date: "" })
            }
            className="flex-shrink-0"
            style={{ height: "40px" }}
          >
            Clear Filters
          </Button>
        </Col>

        {/* VIEW SWITCHER */}
        <Col xs={12} className="text-center mt-4">
          <Button
            variant={viewMode === "card" ? "primary" : "outline-primary"}
            className="me-2"
            onClick={() => setViewMode("card")}
            aria-pressed={viewMode === "card"}
          >
            <FaTh className="me-1" /> Card View
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "outline-primary"}
            className="me-2"
            onClick={() => setViewMode("list")}
            aria-pressed={viewMode === "list"}
          >
            <FaList className="me-1" /> List View
          </Button>
          <Button
            variant={viewMode === "calendar" ? "primary" : "outline-primary"}
            onClick={() => setViewMode("calendar")}
            aria-pressed={viewMode === "calendar"}
            disabled
          >
            <FaCalendarAlt className="me-1" /> Calendar View
          </Button>
        </Col>
      </Row>

      {/* New checkbox to display only events for the users if he is connected */}
      {userId && (
        <Row className="my-3 justify-content-center">
          {" "}
          <Col xs="auto">
            <Form.Check
              type="switch" // A switch is visually nice, otherwise "checkbox"
              id="my-events-filter"
              label="My Events Only"
              checked={showOnlyMyEvents}
              onChange={(e) => setShowOnlyMyEvents(e.target.checked)}
            />
          </Col>
        </Row>
      )}

      {/* Event Display Area */}
      <div className="events-display-area col-lg-10 col-md-11 mx-auto">
        {/* VIEW CARD */}
        {viewMode === "card" && (
          <>
            {/* Current and futures events */}
            <h3 className="mb-3 mt-4 text-center text-md-start">
              Upcoming events
            </h3>
            <Row sm={1} xs={1} md={2} lg={3} xl={3} className="g-4">
              {currentAndFutureEvents.length > 0 ? (
                currentAndFutureEvents.map(renderEventCard)
              ) : (
                <Col>
                  <p className="text-muted text-center mt-3">
                    No upcoming events match your filters.
                  </p>{" "}
                </Col>
              )}
            </Row>

            {/* // Toogle Button for pasts events */}
            {pastEvents.length > 0 && (
              <div className="text-center my-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPastEvents((prev) => !prev)}
                  aria-controls="past-events-collapse-card"
                  aria-expanded={showPastEvents}
                >
                  {showPastEvents ? "Hide" : "Show"} Past Events (
                  {pastEvents.length})
                </Button>
              </div>
            )}

            {/* // Collapsible Past Events Section */}
            <Collapse in={showPastEvents}>
              <div id="past-events-collapse-card">
                <h4 className="text-center text-md-start my-3">Past Events</h4>
                <Row sm={1} xs={1} md={2} lg={3} xl={3} className="g-4">
                  {pastEvents.map(renderEventCard)}
                </Row>
              </div>
            </Collapse>
          </>
        )}

        {/* LIST VIEW */}
        {viewMode === "list" && (
          <>
            {/* current & future events */}
            <h3 className="mb-3 mt-4 text-center text-md-start">
              {" "}
              Upcoming events
            </h3>
            <ul className="list-group">
              {currentAndFutureEvents.length > 0 ? (
                currentAndFutureEvents.map(renderEventListItem)
              ) : (
                <li className="list-group-item text-muted text-center">
                  No upcoming events match your filters.
                </li>
              )}
            </ul>
            {/* Toggle Button for Past Events */}
            {pastEvents.length > 0 && (
              <div className="text-center my-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPastEvents((prev) => !prev)}
                  aria-controls="past-events-collapse-list"
                  aria-expanded={showPastEvents}
                >
                  {showPastEvents ? "Hide" : "Show"} Past Events (
                  {pastEvents.length})
                </Button>
              </div>
            )}

            {/* // Collapsible past Events section */}
            <Collapse in={showPastEvents}>
              <div id="past-events-collapse-list">
                <h4 className="text-center text-md-start my-3">Past Events</h4>
                <ul className="list-group">
                  {pastEvents.map(renderEventListItem)}
                </ul>
              </div>
            </Collapse>
          </>
        )}

        {/* VIEW CALENDAR PLACEHOLDER*/}
        {viewMode === "calendar" && (
          <div className="calendar-view text-center my-5 p-5 border rounded bg-light">
            <FaCalendarAlt size={50} className="text-muted mb-3" />

            <h3 className="text-muted">Calendar view coming soon!</h3>
            <p className="text-muted">
              Check back soon for a new way to visualize events.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
