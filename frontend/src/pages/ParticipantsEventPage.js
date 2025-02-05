import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";


const ParticipantsEventPage = () => {
  const [attendeesTable, setAttendeesTable] = useState([]);
  const [eventsTable, setEventsTable] = useState({});
  const { eventId, attendeeId } = useParams();
  console.log("Params:", { eventId, attendeeId });
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001"; // Fallback to localhost for local development`;

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/${eventId}`);
        console.log(response.data);
        setEventsTable(response.data);
      } catch (error) {
        console.error("Error fetching event data", error);
      }
    };

    const fetchAttendees = async () => {
      try {        
        // fetch the data from the url with all the attendees for a specific event
        const response = await axios.get(`${API_URL}/events/${eventId}/attendees`);
        // const responseEvent = await axios.get(API_URL_EVENT_ID);
        
        console.log(response.data);

        setAttendeesTable(response.data);
        // setEventsTable(responseEvent.data);
      } catch (error) {
        console.error("Error while fetching attendees");
      }
    };
    fetchEventData();
    fetchAttendees();
  }, [eventId]);

  const deleteAttendeeFromEvent = async (attendeeId) => {
    console.log(attendeeId)
  console.log("Params:", { eventId });

    try {
      await axios.delete(`${API_URL}/events/${eventId}/attendees/${attendeeId}`);
      setAttendeesTable(
        attendeesTable.filter((attendee) => attendee.attendee_id !== attendeeId)
      );
      setEventsTable((prev) => ({
        ...prev,
        event_attendees_number: prev.event_attendees_number - 1,
      }));
      console.log("Attendee deleted successfully from the event");
    } catch (error) {
      console.error("Error while deleting attendee");
    }
  };

  return (
    <div className="col-md-9 mx-auto">
    <div>
      <h1 key={eventId}>
        Participants registered: {eventsTable.event_attendees_number ?? 0}
      </h1>
      <h1>Event title: "{eventsTable.event_title || "no title"}"</h1>
    </div>
    <div>
      {attendeesTable.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendeesTable.map((attendee, index) => (
              <tr key={attendee.attendee_id}>
                <td>{index + 1}</td>
                <td>{attendee.attendee_first_name}</td>
                <td>{attendee.attendee_last_name}</td>
                <td>{attendee.attendee_email}</td>
                <td>{attendee.attendee_phone_number}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => deleteAttendeeFromEvent(attendee.attendee_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No attendees for this event</p>
      )}
    </div>
  </div>
  );
};

export default ParticipantsEventPage;
