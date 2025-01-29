import React from "react";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";
import "./about.css"; // Ajouter un fichier CSS pour styliser

const About = () => {
  return (
    <section className="about-us-page py-5" style={{ backgroundColor: "" }}>
      <div className="container text-center">
        <h1 className="mb-4" style={{ fontWeight: "bold" }}>
          About Volunteers4Israel
        </h1>
        <p className="lead text-muted mb-5">
          At Volunteers4Israel, we are driven by a simple idea: empowering
          communities through volunteering. Our platform connects individuals
          and organizations, making it easier than ever to contribute to
          meaningful causes.
        </p>

        <div className="about-history mb-5">
          <h2 className="mb-3 text-primary" style={{ fontWeight: "bold" }}>
            Our Story
          </h2>
          <p className="text-muted">
            Volunteers4Israel was founded in 2024, inspired by the challenge of
            connecting passionate volunteers with impactful missions. Today, we
            are proud to have become a bridge between hundreds of volunteers and
            organizations across Israel.
          </p>
        </div>

        <div className="about-achievements">
          <h2 className="mb-3 text-primary" style={{ fontWeight: "bold" }}>
            Our Achievements
          </h2>
          <ul className="list-unstyled">
            <li className="mb-3">
              <strong>200+</strong> volunteer events organized across various
              sectors, including education, environment, and community support.
            </li>
            <li className="mb-3">
              <strong>5,000+</strong> hours of service contributed in 2024
              alone.
            </li>
            <li className="mb-3">
              <strong>50+</strong> partnerships with local organizations to
              maximize impact.
            </li>
          </ul>
        </div>

        <div className="about-cta mt-5">
          <h3 className="text-primary mb-4" style={{ fontWeight: "bold" }}>
            Join Us Today!
          </h3>
          <p className="text-muted">
            Discover volunteer opportunities that match your passions, build
            meaningful connections, and contribute to projects that create
            lasting change in your community.
          </p>
          <Link
            to="/home#filters-section"
            className="btn btn-primary btn-lg me-3"
          >
            Discover Events
          </Link>
          <Link to="/contact" className="btn btn-primary btn-lg me-3">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
