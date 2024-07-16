import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import AvailableVaccinesComponent from "./components/AvailableVaccinesComponent";
import AddVaccineModal from "./components/AddVaccineModal";
import OfferedVaccinesComponent from "./components/OfferedVaccinesComponent";
import { useNavigate } from "react-router-dom";

const AdminRegisterVaccinePage = () => {
  // for navigation
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={9} xs={12}>
          <Button
            variant="outline-dark"
            onClick={() => navigate("/admin/dashboard")}
          >
            Go Back
          </Button>
          <AvailableVaccinesComponent />
          <AddVaccineModal />
        </Col>
      </Row>
      <Row className="justify-content-md-center mt-3">
        <Col md={9} xs={12}>
          <OfferedVaccinesComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminRegisterVaccinePage;
