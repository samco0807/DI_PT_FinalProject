// backend/src/controllers/eventController.js
import {
  _fetchAllEvents,
  _fetchEvent,
  _createEvent,
  _updateEvent,
  _deleteAllEvents,
  _deleteEvent,
} from "../model/eventModel.js";

export const getAllEvents = async (req, res) => {
  try {
    const gotAllEvents = await _fetchAllEvents();
    res.status(200).json(gotAllEvents);
    console.log("Controller: all events retrieved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching events." });
  }
};

export const getEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const fetchEvent = await _fetchEvent(eventId); // ne pas oublier id comme argument sinon erreur 500, la fonction _getEvent prends eventId comme argument
    if (eventId === -1) {
      res.status(404).json({ message: "This event does not exist" });
    }
    console.log("Controller: event retrieved successfully");
    res.status(200).json(fetchEvent);
  } catch (error) {
    console.error("Controller: error while fetching the event", error);

    res.status(500).json({ message: "Server error while fetching this event" });
  }
};

export const createEvent = async (req, res) => {
  const {
    eventTitle,
    eventDescription,
    eventCategory,
    eventLocation,
    eventDatetime,
    eventAttendeesNumber,
  } = req.body; //title est le nom de la clé que j'ai donné, je peux appeler ça banane
  console.log(
    eventTitle,
    eventDescription,
    eventCategory,
    eventLocation,
    eventDatetime,
    eventAttendeesNumber
  );
  if (!eventTitle) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const newEvent = {
      event_title: eventTitle,
      event_description: eventDescription,
      event_category: eventCategory,
      event_location: eventLocation,
      event_datetime: eventDatetime,
      event_attendees_number: eventAttendeesNumber,
    };
    console.log("Controller: request to create event:", newEvent);
    const createdEvent = await _createEvent(newEvent);
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error("Server error while creating event:", error);
    res.status(500).json({ message: "Server error while creating event." });
  }
};

export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const {
    eventTitle,
    eventDescription,
    eventCategory,
    eventLocation,
    eventDatetime,
    eventAttendeesNumber,
  } = req.body;
  console.log(
    "Controller inputs:",
    eventId,
    eventTitle,
    eventDescription,
    eventCategory,
    eventLocation,
    eventDatetime,
    eventAttendeesNumber
  );

  try {
    // if the event exist
    if (eventId !== -1) {
      const updatedEvent = await _updateEvent({
        event_id: eventId,
        event_title: eventTitle,
        event_description: eventDescription,
        event_category: eventCategory,
        event_location: eventLocation,
        event_datetime: eventDatetime,
        event_attendees_number: eventAttendeesNumber,
      });
      console.log(
        "Controller: event updated successfully:",
        eventId,
        eventTitle,
        eventDescription,
        eventCategory,
        eventLocation,
        eventDatetime,
        eventAttendeesNumber
      );
      res.status(200).json(updatedEvent);
    } else {
      console.log("Controller: event not found");
      res.status(404).json({ "Event not found": error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Server error while updating this event:": error });
  }
};

export const deleteAllEvents = async (req, res) => {
  try {
    await _deleteAllEvents();
    res.status(200).json({ message: "All Events deleted successfully" });
    console.log("Controller: event deleted successfully");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while deleting all events." });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const deletedEvent = await _deleteEvent(eventId);
    // console.log("deleted event id:", eventId);
    console.log("Controller deleted event:", deletedEvent);
    res.status(200).json(deletedEvent);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while deleting this event." });
  }
};
