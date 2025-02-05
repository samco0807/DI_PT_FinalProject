// frontend/src/pages/HomePage.js
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { EventContext } from "../context/EventContext.js";
// import bootstrap features
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
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
  const { eventId } = useParams();

  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001"; // Fallback to localhost for local development
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
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("viewMode") || "card";
  }); // state to manage the active view and to change for calendar or list

  // use useEffect for rendering the page
  useEffect(() => {
    // function to fetch and displays the events
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`); // fetch the event from the URL API
        console.log(API_URL);

        setEventTable(response.data); // display events from the table
        setFilteredEvents(response.data); // display filtered events
        console.log(response.data);
      } catch (error) {
        console.error("Error displaying events");
      }
    };
    fetchEvents();
  }, [setEventTable]);

  useEffect(() => {
    let filtered = eventTable; // initialise filtered event using the events in the database

    if (filters.location) {
      // if the filter for location is not empty
      filtered = filtered.filter((event) =>
        event.event_location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      );
    }

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((event) =>
        filters.categories.includes(event.event_category.toLowerCase())
      );
    }

    if (filters.date) {
      filtered = filtered.filter((event) => event.event_date === filters.date);
    }
    setFilteredEvents(filtered); // initialize the filtered events setter with the filtered data
  }, [filters, eventTable]);

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

  const deleteEvent = async () => {
    const API_URL_EVENT = `${API_URL}/events/${eventId}`;
    console.log(eventId);
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
  const getEventStatus = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);

    if (event.toDateString() === today.toDateString()) {
      return "today";
    } else if (event < today) {
      return "past";
    } else {
      return "future";
    }
  };

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

  return (
    <>
      <div className="mb-4">
        <h1>Welcome on Volunteers4Israel</h1>
        <h4>
          Find, join, and organize volunteer activities across Israel. Together,
          we build a stronger community.
        </h4>
      </div>

      <section className="about-us-section text-center py-5">
        <div className="container">
          <h2 className="mb-4" style={{ fontWeight: "bold" }}>
            Who We Are
          </h2>
          <p className="lead text-muted">
            At Volunteers4Israel, we believe in the power of volunteering to
            create meaningful change. Our mission is to connect volunteers and
            organizations across Israel to make an impact. Since 2024, we have
            been simplifying the process of finding and joining volunteer
            opportunities.
          </p>

          <div className="row text-center my-5">
            <div className="col-md-4">
              <h3 className="text-primary" style={{ fontWeight: "bold" }}>
                5,000+
              </h3>
              <p className="text-muted">Events organized in 2024</p>
            </div>
            <div className="col-md-4">
              <h3 className="text-primary" style={{ fontWeight: "bold" }}>
                150,000+
              </h3>
              <p className="text-muted">Hours of volunteering mobilized</p>
            </div>
            <div className="col-md-4">
              <h3 className="text-primary" style={{ fontWeight: "bold" }}>
                350+
              </h3>
              <p className="text-muted">
                Local & international organizations partnered
              </p>
            </div>
          </div>

          <div>
            <Button
              className="btn btn-primary btn-lg"
              onClick={() => {
                navigate("/aboutus");
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* FILTERS FORM MENU */}
      <Row
        id="filters-section"
        sm={1}
        xs={1}
        md={1}
        lg={1}
        xl={1}
        className="g-4 col-lg-10 col-md-9 col-xs-6 col-sm-5 col-5 mx-auto"
      >
        <div className="filter-container">
          <Form className="d-flex gap-3 align-items-center">
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

            {/* Dropdown to filter by category */}
            <Dropdown
              show={dropdownOpen}
              onToggle={(isOpen) => setDropdownOpen(isOpen)}
              className="w-100 mb-2 mb-md-0"
            >
              <Dropdown.Toggle
                variant="outline-secondary"
                className="w-100 mb-2 mb-md-0"
                style={{
                  height: "40px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={toggleDropDown}
              >
                Filter by category
              </Dropdown.Toggle>

              <Dropdown.Menu>
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
                  <Dropdown.Item
                    key={idx}
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => {
                      handleCheckboxChange({
                        target: {
                          name: option,
                          checked: !filters.categories.includes(
                            option.toLowerCase()
                          ),
                        },
                      });
                    }}
                  >
                    <Form.Check
                      type="checkbox"
                      label={option}
                      name={option}
                      checked={filters.categories.includes(
                        option.toLowerCase()
                      )}
                      readOnly
                    />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Display active filters */}
            <div className="mt-2">
              {filters.categories.length > 0 && (
                <div className="active-filters">
                  {filters.categories.map((category, idx) => (
                    <span key={idx} className="badge bg-success me-2">
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
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Filter by date */}
            <Form.Group controlId="filterByDate" className="w-100 mb-2 mb-md-0">
              <Form.Control
                type="text"
                name="date"
                placeholder="Filter by date"
                value={filters.date ? filters.date : ""}
                onFocus={(e) => {
                  e.target.type = "date";
                }}
                onBlur={(e) => {
                  if (!filters.date) e.target.type = "text";
                }}
                onChange={handleFilterChange}
                className="w-100"
                style={{ height: "40px" }}
              />
            </Form.Group>

            {/* Clear Filters Button */}
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
          </Form>
        </div>
        <div className="view-switcher d-flex justify-content-center mb-4">
          <Button
            variant={viewMode === "card" ? "primary" : "outline-primary"}
            className="me-2"
            onClick={() => setViewMode("card")}
          >
            <FaTh className="me-1" /> Card View
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "outline-primary"}
            className="me-2"
            onClick={() => setViewMode("list")}
          >
            <FaList className="me-1" /> List View
          </Button>
          <Button
            variant={viewMode === "calendar" ? "primary" : "outline-primary"}
            onClick={() => setViewMode("calendar")}
          >
            <FaCalendarAlt className="me-1" /> Calendar View
          </Button>
        </div>
      </Row>

      {/* Display the cards */}
      {/* VIEW CARD */}
      {viewMode === "card" && (
        <Row
          sm={1}
          xs={1}
          md={2}
          lg={3}
          xl={3}
          className="g-4 col-lg-10 col-md-9 mx-auto mt-4"
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.event_id}>
                <Card
                  className={`d-flex flex-column h-100 shadow-sm border-0 ${getEventStatus(
                    event.event_date
                  )}`}
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
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      {event.event_title}
                    </Card.Title>
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
                    <Card.Text>{event.event_description}</Card.Text>

                    {/* Buttons */}
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      <Button
                        variant="outline-primary"
                        className="flex-grow-1 d-flex align-items-center justify-content-center"
                        onClick={() =>
                          navigateToAttendeesEventPage(event.event_id)
                        }
                      >
                        Participants
                        <FaUsers size={16} className="ms-2" />
                      </Button>
                      <Button
                        variant="success"
                        className="flex-grow-1 d-flex align-items-center"
                        onClick={() =>
                          navigateToAttendEventPage(event.event_id)
                        }
                      >
                        <FaCheckCircle size={16} className="me-1" /> Attend
                      </Button>
                      <Button
                        variant="warning"
                        className="flex-grow-1 d-flex align-items-center"
                        onClick={() =>
                          navigateToUpdateEventPage(event.event_id)
                        }
                      >
                        <FaEdit size={16} className="me-1" /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="flex-grow-1 d-flex align-items-center"
                        onClick={() => {
                          if (
                            window.confirm("Are you sure to delete this event?")
                          ) {
                            deleteEvent(event.event_id);
                          }
                        }}
                      >
                        <BsFillTrash3Fill size={16} className="me-1" /> Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p>No event found.</p>
          )}
        </Row>
      )}

      {/* VIEW LIST */}
      {viewMode === "list" && (
        <ul className="list-group col-lg-10 col-md-9 mx-auto">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <li
                key={event.event_id}
                className={`list-group-item p-3 mb-3 border rounded shadow-sm ${getEventStatus(
                  event.event_date
                )}`}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="fw-bold text-primary">
                      {event.event_title}
                    </h5>
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
                  </div>
                  <div>
                    <Badge bg="info" className="fs-6">
                      <FaUsers className="me-1" />
                      {event.event_attendees_number}
                    </Badge>
                  </div>
                </div>

                <p className="text-secondary mt-3">{event.event_description}</p>

                <div className="d-flex justify-content-between mt-3">
                  <Button
                    variant="outline-primary"
                    onClick={() => navigateToAttendeesEventPage(event.event_id)}
                  >
                    Participants
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => navigateToAttendEventPage(event.event_id)}
                  >
                    <FaCheckCircle size={16} className="me-1" /> Attend
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => navigateToUpdateEventPage(event.event_id)}
                  >
                    <FaEdit size={16} className="me-1" /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (
                        window.confirm("Are you sure to delete this event?")
                      ) {
                        deleteEvent(event.event_id);
                      }
                    }}
                  >
                    <BsFillTrash3Fill size={16} className="me-1" /> Delete
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </ul>
      )}

      {/* VIEW CALENDAR */}
      {viewMode === "calendar" && (
        <div className="calendar-view col-lg-10 col-md-9 mx-auto">
          <h3>Calendar view coming soon!</h3>
        </div>
      )}
    </>
  );
};

export default HomePage;
