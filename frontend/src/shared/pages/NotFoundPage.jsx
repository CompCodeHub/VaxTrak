import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Responsble to load not found page
const NotFoundPage = () => {
  // For navigation
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Image src="/images/notfound.jpg" style={{height: "200px", width: "200px"}} fluid alt="404 Not Found" />
          <p className="lead">
            Sorry, the page you are looking for does not exist.
          </p>
          <Button variant="dark" onClick={() => navigate("/")}>
            Go To Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
