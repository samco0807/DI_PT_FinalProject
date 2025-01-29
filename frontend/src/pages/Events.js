import React, { useEffect, useContext } from "react";
import axios from "axios";
import { Route } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { EventContext } from "../context/EventContext.js";
import CreateEventForm from "./CreateEventForm.js";

const Events = () => {
  const [eventTable, setEventTable, eventInput, setEventInput] =
    useContext(EventContext);
  const API_URL = "http://localhost:3000/";

  useEffect(() => {
    const displayEvents = async () => {
      try {
        const getEventsData = await axios.get(`${API_URL}`);
        setEventTable(getEventsData.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    displayEvents();
  }, [setEventTable]);

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`${API_URL}/events/${id}`);
      setEventTable(eventTable.filter((event) => event.id !== id));
      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Deleting this event failed", error);
    }
  };

  const updateEvent = async (id, newTitle) => {
    if (!newTitle) {
      console.error("Title is required");
      return;
    }
    try {
      console.log(
        "Trying to update event with ID:",
        id,
        "to new title",
        newTitle
      );
      const response = await axios.put(`${API_URL}/events/${id}`, {
        title: newTitle,
      });
      console.log("Update event response:", response);
      if (response.status === 200) {
        setEventTable(
          eventTable.map((event) =>
            event.id === id ? { ...event, title: newTitle } : event
          )
        );

        console.log("Event updated successfully");
      } else {
        console.error("Failed to update event", response.data);
      }
    } catch (error) {
      console.error("Updating event failed", error);
    }
  };

  return (
    <div>
      <>
        <h1>Events</h1>
        <ul>
          {eventTable.map((event) => (
            <li key={event.id}>
              <h2>title: {event.title}</h2>
              {/* <h2>Description: {event.description}</h2> */}
              <button onClick={() => deleteEvent(event.id)}></button>
              <input
                type="text"
                placeholder="New title"
                onChange={(e) => {
                  setEventInput(e.target.value);
                }}
              ></input>
              <button
                onClick={() => updateEvent(event.id, eventInput[event.id])}
              >
                Update
              </button>
            </li>
          ))}
        </ul>
      </>

      <Route to="/createevent" element={<CreateEventForm />}>
        <Button>Create Event</Button>
      </Route>
    </div>
  );
};

export default Events;
