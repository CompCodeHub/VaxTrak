import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

// Navigation links for main navbar
const Navlinks = () => {
    return (
        <Nav className="ms-auto">
            <Nav.Link as={NavLink} to={"/"}>Home</Nav.Link>
            <Nav.Link as={NavLink} to={"/login"}>Login</Nav.Link>
            <Nav.Link as={NavLink} to={"/about"}>About</Nav.Link>
        </Nav>
    )
}

export default Navlinks;