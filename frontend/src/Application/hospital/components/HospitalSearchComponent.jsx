import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

const HospitalSearchComponent = () => {
  return (
    <Form>
      <Row className="align-items-end justify-content-md-center">
        <Col className="col-md-2">
          <Form.Group>
            <Form.Label>Search By</Form.Label>
            <Form.Select>
              <option value="location">Location</option>
              <option value="pincode">Pincode</option>
              <option value="name">Name</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col className="col-md-6">
          <Form.Group>
            <Form.Label>Search</Form.Label>
            <Form.Control type="text" placeholder="Enter search keywords" />
          </Form.Group>
        </Col>
        <Col className="col-md-2">
          <Button variant="outline-dark" type="submit">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default HospitalSearchComponent;
