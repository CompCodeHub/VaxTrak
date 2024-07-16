import { useNavigate } from "react-router-dom";
import React from "react";
import { Button, Col, Container, Row, Image, Carousel } from "react-bootstrap";
import WatchList from "../components/HomePage/WatchList";

const HomePage = () => {
  // for navigation
  const navigate = useNavigate();

  return (
    <Container className="text-center" style={{ backgroundColor: "#f8f9fa" }}>
      <Row className="justify-content-center mb-5">
        <Col md={10}>
          <Image
            src="/images/VaxTrak.jpg"
            alt="VaxTrak Logo"
            style={{ height: "550px", width: "1000px" }}
            className="mb-3"
          />
          <h1>Welcome to VaxTrak</h1>
          <p>Streamlining Vaccination Efforts with Precision and Ease</p>
          <Button
            variant="dark"
            className="me-2"
            onClick={() => navigate("/user/dashboard")}
          >
            Make an Appointment
          </Button>
          <Button
            variant="dark"
            onClick={() => navigate("/hospitals/register")}
          >
            Register Hospital
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <h2>About Us</h2>
          <p>
            Welcome to VaxTrak, we are providing vaccinations in collaboration
            with hospitals since 2024.{" "}
          </p>
        </Col>
      </Row>
      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <h2>Statistics</h2>
          <WatchList />
        </Col>
      </Row>
      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <h2>Services</h2>
          <Carousel>
            <Carousel.Item interval={2000}>
              <Image
                src="/images/placeholder.jpg"
                alt="Making Vaccination Appointments"
                fluid
              />
              <Carousel.Caption>
                <h3>Making Vaccination Appointments</h3>
                <p>Registering and managing appointments</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={2000}>
              <Image
                src="/images/placeholder.jpg"
                alt="Managing Patient Appointments"
                fluid
              />
              <Carousel.Caption>
                <h3>Managing patient Appoinments</h3>
                <p>
                  Managing patient appointments and ensuring proper scheduling
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <Image
                src="/images/placeholder.jpg"
                alt="Vaccination Reports"
                fluid
              />
              <Carousel.Caption>
                <h3>Vaccination Reports</h3>
                <p>Generating and accessing vaccination reports for patients</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
