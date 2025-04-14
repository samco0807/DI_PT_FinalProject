// frontend/src/App.js
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import { EventProvider } from "./context/EventContext";
import { ThemeContext } from "./context/ThemeContext.js";
import NavBar from "./components/Navbar.js";
import HomePage from "./pages/HomePage.js";
import CreateEventForm from "./pages/CreateEventForm.js";
import UpdateEventForm from "./pages/UpdateEventForm.js";
import AttendEventForm from "./pages/AttendEventForm.js";
import ContactForm from "./pages/Contact.js";
import MyProfile from "./pages/MyProfile.js";
import AboutUs from "./pages/About.js";
import LoginForm from "./pages/Login.js";
import SignUpForm from "./pages/Signup.js";
import Footer from "./components/Footer.js";
import ParticipantsEventPage from "./pages/ParticipantsEventPage.js";
import "./App.css";

const App = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`App ${theme}`}>
      <EventProvider>
        <AuthProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/createevent" element={<CreateEventForm />} />
            <Route
              path="/events/:eventId/updateevent"
              element={<UpdateEventForm />}
            />
            <Route
              path="/events/:eventId/attendeventform"
              element={<AttendEventForm />}
            />
            <Route
              path="/events/:eventId/attendees"
              element={<ParticipantsEventPage />}
            />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </EventProvider>
    </div>
  );
};

export default App;
