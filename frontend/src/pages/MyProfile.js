// root/frontend/src/pages/myprofile.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Keep for token access, even if assumed present
import axios from "axios";
// import icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faUser,
  faCalendar,
  faIdBadge, // Icon for Role
  faSpinner, // For loading
  faExclamationTriangle, // For error
  faUserCircle, // Placeholder icon if no real image
  faBuilding, // Suggestion: Icon for Organization (if applicable)
  faTicketAlt, // Suggestion: Icon for event stats
} from "@fortawesome/free-solid-svg-icons";

// Component for displaying errors
const ErrorDisplay = ({ message }) => (
  <div className="alert alert-danger d-flex align-items-center" role="alert">
    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2 flex-shrink-0" />
    <div>{message || "Une erreur est survenue."}</div>
  </div>
);

// Component for loading state
const LoadingSpinner = () => (
  <div className="text-center py-5">
    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    <p className="mt-3 text-muted">Chargement de votre profil...</p>
  </div>
);

const MyProfile = () => {
  // Use environment variable for API URL, fallback for local dev
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
  const { token } = useAuth(); // Still need token for the API call header/auth
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading immediately
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true); // Ensure loading is true at the start of fetch
      setError(null); // Reset error state on new fetch attempt

      try {
        const res = await axios.get(`${API_URL}/myprofile`, {
           // Axios automatically handles credentials if backend CORS is set correctly
           // but explicitly including Authorization header is often clearer/necessary
           headers: {
             Authorization: `Bearer ${token}`, // Assuming Bearer token scheme
           },
           withCredentials: true, // Keep if using cookies/sessions
        });
        setProfileData(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        // Try to get a more specific error message from the response
        const errorMessage = err.response?.data?.message || err.message || "Impossible de charger les données du profil.";
        setError(errorMessage);
      } finally {
        // This block executes whether the try succeeded or failed
        setLoading(false);
      }
    };

    fetchProfile();
    // Dependency array: fetch again if token or API_URL changes.
  }, [token, API_URL]);

  // --- Conditional Rendering ---

  // 1. Handle Loading State
  if (loading) {
    return <LoadingSpinner />;
  }

  // 2. Handle Error State
  if (error) {
    return (
        <div className="container mt-5">
             <ErrorDisplay message={error} />
        </div>
    );
  }

  // 3. Handle case where data fetch succeeded but returned no data (unlikely for 'myprofile' but good practice)
  if (!profileData) {
     return (
        <div className="container mt-5">
            <ErrorDisplay message="No data found." />
        </div>
    );
  }

  // --- Render Profile Data ---
  // Destructure for easier access (optional)
  const { firstName, lastName, email, phoneNumber, role, avatarUrl, eventCount /*, totalParticipants - add if available */ } = profileData;

  return (
    <div className="container mt-5 mb-5"> {/* Added mb-5 for bottom spacing */}
      <h1 className="mb-4">My profile</h1>
      <div className="row g-4"> {/* g-4 for gutter spacing between columns */}

        {/* Column 1: Avatar */}
        <div className="col-md-4 text-center text-md-start">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${firstName} ${lastName}'s Avatar`}
              className="img-fluid rounded-circle mb-3 mx-auto mx-md-0 d-block" // Centered on mobile, left on md+
              style={{ maxWidth: "200px", height: "auto" }} // Control image size
            />
          ) : (
            // Placeholder Icon if no avatar URL
            <div className="mb-3 text-center "> {/* Center icon */}
               <FontAwesomeIcon
                  icon={faUserCircle}
                  size="10x" // Adjust size as needed
                  className="text-secondary opacity-50" // Style the placeholder
                />
            </div>
          )}
           {/* Edit button can be here or under details */}
           {/* <button className="btn btn-outline-secondary mt-3 w-100">Modifier l'avatar</button> */}
        </div>

        {/* Column 2: Details */}
        <div className="col-md-8">
          {/* Name and Role */}
          <h2 className="mb-1">{firstName} {lastName}</h2>
          <p className="lead text-muted mb-4">
             <FontAwesomeIcon icon={faIdBadge} className="me-2" />
             {role || "Undefined role"} {/* Display role from data, with fallback */}
          </p>

          {/* Card: Contact Information */}
          <div className="card shadow-sm mb-4"> {/* Added subtle shadow */}
            <div className="card-body">
              <h5 className="card-title mb-3">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Contact Informations
              </h5>
              <p className="card-text mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="me-2 fa-fw" /> {/* fa-fw for fixed width */}
                {email}
              </p>
              {phoneNumber && ( // Only display phone if available
                <p className="card-text mb-2">
                  <FontAwesomeIcon icon={faPhone} className="me-2 fa-fw" />
                  {phoneNumber}
                </p>
              )}
               {/* Add other relevant info here if needed, e.g., Organization */}
               {/* <p className="card-text mb-2">
                  <FontAwesomeIcon icon={faBuilding} className="me-2 fa-fw" />
                  {profileData.organization || "N/A"}
                </p> */}
            </div>
          </div>

          {/* Card: Event Statistics (Example) */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <FontAwesomeIcon icon={faCalendar} className="me-2" />
                Events
              </h5>
              <p className="card-text mb-2">
                <FontAwesomeIcon icon={faTicketAlt} className="me-2 fa-fw" />
                 Created events : {eventCount !== undefined ? eventCount : "N/A"} {/* Handle undefined */}
              </p>
              {/* Example: Add total participants if data is available */}
              {/* {profileData.totalParticipants !== undefined && (
                <p className="card-text mb-2">
                    <FontAwesomeIcon icon={faUsers} className="me-2 fa-fw" />
                    Total des participants : {profileData.totalParticipants}
                </p>
              )} */}
               <p className="card-text text-muted">
                   {/* Placeholder if more stats needed */}
                   More stats to come...
               </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4">
             <button className="btn btn-primary me-2">
                Edit profile
             </button>
             {/* Add other actions if needed, e.g., Change Password */}
             {/* <button className="btn btn-outline-secondary">Changer le mot de passe</button> */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyProfile;