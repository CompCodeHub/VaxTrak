import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Navlinks from "./Navlinks";

const MainNavigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-static-top">
      <Container>
        <Navbar.Brand as={Link} to={"/"} className="text-lg-start">
          VaxTrak
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Navlinks />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavigation;