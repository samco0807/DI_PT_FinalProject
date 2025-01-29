import React, { createContext, useState } from "react";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [eventInput, setEventInput] = useState({ title: "" });
  const [eventTable, setEventTable] = useState([]);
  return (
    <EventContext.Provider
      value={{
        eventInput,
        setEventInput,
        eventTable,
        setEventTable,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};