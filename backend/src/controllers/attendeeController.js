// backend/src/controllers/attendeeController.js
import {
  _createAttendee,
  _updateEventNumberOfAttendees,
  _fetchEventAttendees,
  _fetchEventAttendee,
  _deleteAllAttendees,
  _deleteAttendee,
} from "../model/attendeeModel.js";

// Function to fetch the attendees of an event
export const fetchEventAttendees = async (req, res) => {
  const { eventId } = req.params;
  console.log("Controller event id:", eventId);
  try {
    const fetchAttendees = await _fetchEventAttendees(eventId);
    if (fetchAttendees.length > 0) {
      console.log(" Controller Attendees fetch successfully");
      res.status(200).json(fetchAttendees);
    } else {
      res.status(404).json({ message: "No attendees for this event." });
    }
  } catch (error) {
    console.error("Internet server error:", error);
    res.status(500).json({ message: "Error fetching attendees" });
  }
};

// Function to fetch a specific attendee of an event
export const fetchEventAttendee = async (req, res) => {
  const { eventId, attendeeId } = req.params;
  // console.log("Event ID:", eventId);
  // console.log("Attendee ID:", attendeeId);
  try {
    const fetchedAttendee = await _fetchEventAttendee(eventId, attendeeId);
    if (fetchedAttendee) {
      res.status(200).json(fetchedAttendee);
    } else {
      res
        .status(200)
        .json({ message: "This attendee is not registered in this event." });
    }
  } catch (error) {
    console.error("Internet server error:", error);
    res.status(500).json({ message: "Error fetching the attendee" });
  }
};

// Controller to add attendee and increment +1 in attendee column events table
export const registerAttendeeAndUpdateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { firstName, lastName, email, phoneNumber } = req.body;

  try {
    // Create an attendee
    const newAttendee = {
      attendee_first_name: firstName,
      attendee_last_name: lastName,
      attendee_email: email,
      attendee_phone_number: phoneNumber,
      event_id: parseInt(eventId), // Convert into integer
    };
    console.log(
      "Controller new Attendee:",
      firstName,
      lastName,
      email,
      phoneNumber,
      eventId
    );
    // Call the model function to add attendee
    const createdAttendee = await _createAttendee(newAttendee);
    console.log(
      "Controller New attendee for the event created:",
      firstName,
      lastName,
      email,
      phoneNumber,
      eventId
    );

    if (!createdAttendee || createdAttendee.length === 0) {
      throw new Error("Failed to add attendee to the database");
    }

    // call the model function to increment +1 in the events table attendee column
    const updateEventNumberOfAttendees = await _updateEventNumberOfAttendees(
      eventId
    );
    console.log(
      "Number of participants updated:",
      updateEventNumberOfAttendees
    );
    res.status(201).json(updateEventNumberOfAttendees);
  } catch (error) {
    console.error("Error registering attendee or updating event", error);
    res
      .status(500)
      .json({ error: "Failed to register attendee or update event" });
  }
};

export const deleteAttendeeAndUpdateEvent = async (req, res) => {
  // Define parameters variables
  const { eventId, attendeeId } = req.params;
  console.log(eventId, attendeeId);
  try {
    // Step 1: delete participant from the attendees table
    if (!eventId || !attendeeId) {
      throw new Error("Missing eventId or attendeeId");
    }
    const deletedAttendee = await _deleteAttendee(attendeeId, eventId);
    res.status(200).json(deletedAttendee);
    if (!deletedAttendee) {
      res.status(404).json({ error: "Attendee not found" });
    }
    console.log("Deleted attendee id:", attendeeId);
    console.log("Controller deleted event:", deletedAttendee);

    // Step 2: update the participants number in the events table
    const updateEventNumberOfAttendees = await _updateEventNumberOfAttendees(
      eventId
    );
    console.log(updateEventNumberOfAttendees)
  } catch (error) {
    console.error(error);
  }
};

export const deleteAllAttendees = async (req, res) => {
  try {
    await _deleteAllAttendees();
    res.status(200).json({ message: "All attendees deleted successfully" });
    console.log("Controller: all attendees deleted successfully");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while deleting all attendees." });
  }
};
