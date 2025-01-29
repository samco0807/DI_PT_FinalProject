// backend/src/model/attendeeModel.js
import db from "../config/knex.js";

// Function to create new attendee
export const _createAttendee = async ({
  attendee_first_name: firstName,
  attendee_last_name: lastName,
  attendee_email: email,
  attendee_phone_number: phoneNumber,
  event_id: eventId,
}) => {
  try {
    console.log("Model type de event_id:", eventId);

    // Step 1: Add new attendee to the attendees table once he filled the event attendance form
    const newAttendee = await db("attendees").insert({
      attendee_first_name: firstName,
      attendee_last_name: lastName,
      attendee_email: email,
      attendee_phone_number: phoneNumber,
      event_id: parseInt(eventId),
    });
    console.log(
      "Model Attendee created successfully in the database:",
      firstName,
      lastName,
      email,
      phoneNumber,
      eventId
    );
    return newAttendee;
  } catch (error) {
    console.error("Model: Failed to create the attendee entry", error);
    throw new Error("Model: impossible to create this attendee");
  }
};

// Function model update attendees number in events table
export const _updateEventNumberOfAttendees = async (eventId) => {
  try {
    // check if the event exists
    const eventExists = await db("events").where({ event_id: eventId }).first();
    if (!eventExists) {
      throw new Error("Event not found");
    }
    // count the attendee number for the specific event
    const attendeesCount = await db("attendees")
      .where({ event_id: eventId })
      .count("attendee_id as count");
    const count = attendeesCount[0].count || 0;

    // update the column event_attendee_number of the events table
    return await db("events")
      .where({ event_id: eventId })
      .update({ event_attendees_number: count })
      .returning("*");
  } catch (error) {
    console.error("Error incrementing attendee count", error);
    throw new Error("Model: Unable to increment attendees count");
  }
};

// Function model to fetch the attendees of a specific event
export const _fetchEventAttendees = async (event_id) => {
  try {
    // console.log("event ID:", event_id);
    const fetchAttendees = await db("attendees").where({ event_id });
    if (fetchAttendees) {
      // console.log("Model: All attendees fetched successfully");
      return fetchAttendees;
    }
    console.log("Model: No attendees for this event");
  } catch (error) {
    console.error("Model: Error fetching attendees ", error);
  }
};

// Function model to fetch a specific attendees of a specific event
export const _fetchEventAttendee = async (event_id, attendee_id) => {
  console.log("The ID for event and attendee are:", event_id, attendee_id);
  try {
    const gotAttendee = await db("attendees")
      .where({ event_id, attendee_id })
      .first();
    if (gotAttendee) {
      return gotAttendee;
    }
    console.log("This attendee do not participate is this event");
  } catch (error) {
    console.error("Error getting attendees ", error);
  }
};

export const syncEventAttendeesCount = async () => {
  try {
    const events = await db("events").select("event_id");

    for (const event of events) {
      const attendeesCount = await db("attendees")
        .where({ event_id: event.event_id })
        .count("attendee_id as count");
      const count = attendeesCount[0].Error;
      await db("events")
        .where({ event_id: event.event_id })
        .update({ event_attendees_number: count });
    }
    console.log("Event attendees count synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing attendees count", error);
  }
};

export const _deleteAttendee = async (attendee_id, event_id) => {
  console.log(
    "Deleting attendee with ID:",
    attendee_id,
    "for the event ID:",
    event_id
  );
  try {
    const deletedAttendee = await db("attendees")
      .where({ attendee_id, event_id })
      .del();
    console.log("Model: attendee deleted successfully");
    if (deletedAttendee) {
      await db("events")
        .where({ event_id })
        .decrement("event_attendees_number", 1);
    }
    return deletedAttendee;
  } catch (error) {
    console.error("Failed to delete this attendee", error);
  }
};

export const _deleteAllAttendees = () => {
  try {
    const deletedAllAttendees = db("attendees").del();
    console.log("Model: all events deleted successfully");
    return deletedAllAttendees;
  } catch (error) {
    console.error("Failed to delete all events", error);
  }
};
