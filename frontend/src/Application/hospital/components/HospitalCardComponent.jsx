import React from "react";
import { Button, Card } from "react-bootstrap";

const HospitalCardComponent = ({ hospital, openModal }) => {
  return (
    <Card
      className="h-100"
      style={{ width: "18rem", height: "auto", marginBottom: "1rem" }}
    >
      <Card.Img
        variant="top"
        src={hospital.image.url}
        style={{ height: "150px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{hospital.name}</Card.Title>
        <Card.Text>
          Timings - {hospital.openingTime} to {hospital.closingTime}
        </Card.Text>
        <Card.Text>Address - {hospital.address}</Card.Text>
        <Card.Text>Contact - {hospital.contact}</Card.Text>
        <Button variant="outline-dark" className="mt-auto" onClick={() => openModal(hospital._id)}>
          Select
        </Button>
      </Card.Body>
    </Card>
  );
};

export default HospitalCardComponent;
