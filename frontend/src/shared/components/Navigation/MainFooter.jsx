import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const MainFooter = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3 text-muted">
            Copyright &copy; 2024 VaxTrak Pro. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MainFooter;
