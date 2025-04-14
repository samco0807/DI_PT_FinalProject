// root/frontend/src/components/Navbar.js
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext.js";
import { useAuth } from "../context/AuthContext.js";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { BsSun, BsFillMoonFill } from "react-icons/bs";

const NavBar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { token, role, handleLogout } = useAuth();

  useEffect(() => {
    console.log("Navbar - Token:", token, "Role: ", role);
  }, [token, role]);

  return (
    <Navbar
      expand="lg"
      className={`navbar ${theme}`}
      style={{ padding: "10px 20px" }}
    >
      <Container fluid>
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/home" className="me-5">
          <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            Volunteers4Israel
          </span>
        </Navbar.Brand>

        {/* TOGGLE MENU (Responsive) */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* MENU LEFT LINKS */}
          <Nav className="me-auto align-items-center">
            {/* Always display About Us and Contact */}
            {token && role === "organizer" && (
              <Nav.Link as={Link} to="/createevent" className="me-3">
                Create Event
              </Nav.Link>
            )}

            <Nav.Link as={Link} to="/aboutus" className="me-3">
              About Us
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="me-3">
              Contact
            </Nav.Link>
          </Nav>

          {/* MENU RIGHT LINKS */}
          <Nav className="align-items-center">
            {/* Option for connected user */}
            {token && role === "organizer" ? (
              <>
                <Nav.Link as={Link} to="/myprofile" className="me-3">
                  My Profile
                </Nav.Link>
                <Button
                  onClick={handleLogout}
                  variant="outline-danger"
                  className="me-3"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Options for non logged in users */}
                {!token && (
                  <>
                    <Nav.Link as={Link} to="/login" className="me-3">
                      Login
                    </Nav.Link>
                    <Nav.Link as={Link} to="/signup" className="me-3">
                      Sign Up
                    </Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>

          {/* THEME TOGGLE BUTTON */}
          <Button
            onClick={toggleTheme}
            className="ms-3"
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
            }}
          >
            {theme === "dark" ? (
              <BsSun style={{ color: "#ffc107" }} />
            ) : (
              <BsFillMoonFill style={{ color: "#000" }} />
            )}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
