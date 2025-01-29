import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext.js";
import { BsSun, BsFillMoonFill } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";

const NavBar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* MENU LINKS */}
          <Nav className="me-auto align-items-center">
            <Nav.Link as={Link} to="/createevent" className="me-3">
              Create Event
            </Nav.Link>
            <Nav.Link as={Link} to="/aboutus" className="me-3">
              About Us
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="me-3">
              Contact
            </Nav.Link>
          </Nav>

          {/* USER MENU */}
          <Nav className="align-items-center">
            <Nav.Link as={Link} to="/login" className="me-3">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/signup" className="me-3">
              Sign Up
            </Nav.Link>
            <Nav.Link as={Link} to="/myprofile">
              <FaUserCircle size={28} />
            </Nav.Link>
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
