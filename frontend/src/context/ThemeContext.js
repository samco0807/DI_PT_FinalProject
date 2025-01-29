// src/context/ThemeContext.js
import React, { useState, useEffect, createContext } from "react";

const ThemeContext = createContext(); //create the context with useContext

const ThemeProvider = ({ children }) => {
  // storage of dark theme is localStorage
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    // Add the setAttribute dark theme to the html tag
    document.querySelector("html").setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // function to swich theme while clicking on the button
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* children is all the children that are wrapped by the theme */}
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
