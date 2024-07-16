import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import AppointmentListComponent from "./components/AppointmentListComponent";

const UserAppointmentsPage = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2>Your Appointments</h2>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col>
          <AppointmentListComponent />
        </Col>
      </Row>
    </Container>
  );
};
export default UserAppointmentsPage;
