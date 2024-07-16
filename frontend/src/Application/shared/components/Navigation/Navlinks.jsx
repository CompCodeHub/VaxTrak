import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../../../slices/adminAuthSlice";
import { logoutUser } from "../../../../slices/userAuthSlice";

// Navigation links for main navbar
const Navlinks = () => {
  // Get access to admin auth slice
  const { adminInfo } = useSelector((state) => state.adminAuth);

  // Get access to user auth slice
  const { userInfo } = useSelector((state) => state.userAuth);

  // for dispatching actions
  const dispatch = useDispatch();

  // for navigation
  const navigate = useNavigate();

  // Logout admin handler
  const handleAdminLogout = () => {
    // Dispatch logout action
    dispatch(logoutAdmin());

    // Navigate to home page
    navigate("/");
  };

  const handleUserLogout = () => {
    // Dispatch logout action
    dispatch(logoutUser());

    // Navigate to home page
    navigate("/");
  };

  return (
    <Nav className="ms-auto">
      <Nav.Link as={NavLink} to={"/"}>
        Home
      </Nav.Link>
      <Nav.Link as={NavLink} to={"/about"}>
        About
      </Nav.Link>
      {adminInfo ? (
        <>
          <Nav.Link as={NavLink} to={"/admin/dashboard"}>
            Dashboard
          </Nav.Link>
          <NavDropdown
            title="Actions"
            id="basic-nav-dropdown"
            menuVariant="dark"
          >
            <NavDropdown.Item as={NavLink} to={"/admin/register-vaccine"}>
              Register New Vaccine
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to={"/admin/approve"}>
              Approve Appointments
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to={"/admin/reports"}>
              View Reports
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleAdminLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </>
      ) : userInfo ? (
        <>
          <Nav.Link as={NavLink} to={"/user/dashboard"}>
            Dashboard
          </Nav.Link>
          <NavDropdown
            title="Actions"
            id="basic-nav-dropdown"
            menuVariant="dark"
          >
            <NavDropdown.Item as={NavLink} to={"/user/appointments"}>
              My Appointments
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleUserLogout}>
                Logout
              </NavDropdown.Item>
          </NavDropdown>
        </>
      ) : (
        <>
          {" "}
          <Nav.Link as={NavLink} to={"/user/login"}>
            User Login
          </Nav.Link>
          <Nav.Link as={NavLink} to={"/admin/login"}>
            Admin Login
          </Nav.Link>
        </>
      )}
    </Nav>
  );
};

export default Navlinks;
