import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Instantiates the DOM link safely 
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Critical Error: HTML root element element not found!");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}