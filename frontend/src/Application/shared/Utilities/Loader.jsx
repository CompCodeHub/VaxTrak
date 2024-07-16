import React from "react";
import { Spinner } from "react-bootstrap";

// Responsible for loader component
const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        margin: "auto",
        height: "100px",
        width: "100px",
        display: "block",
      }}
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export default Loader;
