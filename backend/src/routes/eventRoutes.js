// backend/src/routes/eventRoutes.js
import {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteAllEvents,
  deleteEvent,
} from "../controllers/eventController.js";

import {
  registerAttendeeAndUpdateEvent,
  fetchEventAttendees,
  fetchEventAttendee,
  deleteAllAttendees,
  deleteAttendeeAndUpdateEvent,
} from "../controllers/attendeeController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

import { Router } from "express";

const router = Router();

// routes for events
router.get("/events", getAllEvents);
router.get("/events/:eventId", getEvent);
router.post("/events", authenticateJWT, createEvent);
router.put("/events/:eventId", updateEvent);
router.delete("/events", deleteAllEvents);
router.delete("/events/:eventId", deleteEvent);

// route to create an attendee
router.post("/events/:eventId/attendees", registerAttendeeAndUpdateEvent);
// route to update the number of attendees for a specific event
router.put("/events/:eventId/attendees", registerAttendeeAndUpdateEvent);
// route to fetch the list of attendees of a specific event
router.get("/events/:eventId/attendees", fetchEventAttendees);
// route to delete a specific attendee in an event
router.delete(
  "/events/:eventId/attendees/:attendeeId",
  deleteAttendeeAndUpdateEvent
);
// route to fetch a specific attendee of a specific event
router.get("/events/:eventId/attendees/:attendeeId", fetchEventAttendee);

// NOT USED
// route to delete all the attendees
router.delete("/events/:eventId/attendees", deleteAllAttendees);

export default router;
