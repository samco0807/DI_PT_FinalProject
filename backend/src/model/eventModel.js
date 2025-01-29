// backend/src/model/eventmodel.js
import db from "../config/knex.js";

// Function to fetch all events
export const _fetchAllEvents = () => {
  try {
    const gotAllEvents = db("events")
      .select(
        "event_id",
        "event_title",
        "event_description",
        "event_category",
        "event_location",
        "event_attendees_number",
        "event_datetime",
        db.raw("TO_CHAR(event_datetime, 'YYYY-MM-DD') AS event_date"),
        db.raw("TO_CHAR(event_datetime, 'HH24:MI') AS event_time")
      )
      .orderBy("event_date", "desc");
    console.log("Model: All events retrieved successfully");
    return gotAllEvents;
  } catch (error) {
    console.error("Failed to retrived all events", error);
  }
};

// Function to get a specific event with id
export const _fetchEvent = (event_id) => {
  try {
    const gotEvent = db("events").where({ event_id }).first();
    if (gotEvent) {
      console.log("Model: event retrieved successfully");
      return gotEvent;
    } else {
      res.status(404).json({ message: "Event not found" });
      throw new Error("event not found");
    }
  } catch (error) {
    console.error("Model Failed to retrieve event", error);
    res.status(500).json({ message: "Server error while fetching event" });
    throw Error("Server error while fetching event");
  }
};

// Function to create an event in the database
export const _createEvent = ({
  event_title: event_title,
  event_description: event_description,
  event_category: event_category,
  event_location: event_location,
  event_datetime: event_datetime,
}) => {
  try {
    const createdEvent = db("events").insert({
      event_title: event_title,
      event_description: event_description,
      event_category: event_category,
      event_location: event_location,
      event_datetime: event_datetime,
    });
    console.log("Model: event created successfully");
    return createdEvent;
  } catch (error) {
    console.error("Failed to create event", error);
  }
};

// Function to update an event
export const _updateEvent = ({
  event_id,
  event_title,
  event_description,
  event_category,
  event_location,
  event_datetime,
  event_attendees_number,
}) => {
  console.log(
    "Model: event updated successfully:",
    event_id,
    event_title,
    event_description,
    event_category,
    event_location,
    event_datetime,
    event_attendees_number
  );
  try {
    const updatedEvent = db("events").where({ event_id: event_id }).update(
      {
        event_id: event_id,
        event_title: event_title,
        event_description: event_description,
        event_category: event_category,
        event_location: event_location,
        event_datetime: event_datetime,
        event_attendees_number: event_attendees_number,
      },
      [
        "event_id",
        "event_title",
        "event_description",
        "event_category",
        "event_location",
        "event_datetime",
        "event_attendees_number",
      ]
    );

    return updatedEvent;
  } catch (error) {
    console.error("Failed to update event", error);
  }
};

export const _deleteAllEvents = () => {
  try {
    const deletedAllEvents = db("events").del();
    console.log("Model: all events deleted successfully");
    return deletedAllEvents;
  } catch (error) {
    console.error("Failed to delete all events", error);
  }
};

export const _deleteEvent = (event_id) => {
  try {
    const deletedEvent = db("events").where({ event_id }).del();
    console.log("Model: event deleted successfully");
    return deletedEvent;
  } catch (error) {
    console.error("Failed to delete event", error);
  }
};
