// root/frontend/src/components/footer.js
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer
      className={`footer ${theme}`}
      style={{
        padding: "1rem",
        textAlign: "center",
        backgroundColor: theme === "dark" ? "#343a40" : "#f8f9fa",
        color: theme === "dark" ? "#f8f9fa" : "#343a40",
        marginTop: "2rem",
        borderTop: theme === "dark" ? "1px solid #555" : "1px solid #ddd",
      }}
    >
      <div>
        <p style={{ margin: 0 }}>Samuel Cohen &copy; 2024</p>
        <p style={{ fontSize: "0.9rem", margin: 0 }}>Final project</p>
      </div>
      <div style={{ marginTop: "0.5rem" }}>
        <a
          href="https://.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme === "dark" ? "#f8f9fa" : "#343a40", margin: "0 10px" }}
        >
          <FaFacebook size={20} />
        </a>
        <a
          href="http://"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme === "dark" ? "#f8f9fa" : "#343a40", margin: "0 10px" }}
        >
          <FaXTwitter size={20} />
        </a>
        <a
          href="http://"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme === "dark" ? "#f8f9fa" : "#343a40", margin: "0 10px" }}
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="http://"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme === "dark" ? "#f8f9fa" : "#343a40", margin: "0 10px" }}
        >
          <FaTiktok size={20} />
        </a>
      </div>
      <div style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
        <a
          href="/about"
          style={{
            color: theme === "dark" ? "#f8f9fa" : "#343a40",
            textDecoration: "none",
            margin: "0 10px",
          }}
        >
          About Us
        </a>
        |
        <a
          href="/contact"
          style={{
            color: theme === "dark" ? "#f8f9fa" : "#343a40",
            textDecoration: "none",
            margin: "0 10px",
          }}
        >
          Contact
        </a>
        |
        <a
          href="/privacy"
          style={{
            color: theme === "dark" ? "#f8f9fa" : "#343a40",
            textDecoration: "none",
            margin: "0 10px",
          }}
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
