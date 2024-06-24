import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

const HomePage = () => {
  return (
    <Container className="text-center mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1>Welcome to VaxTrak</h1>
          <p>Streamlining Vaccination Efforts with Precision and Ease</p>
          <Button variant="dark">Learn More</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
