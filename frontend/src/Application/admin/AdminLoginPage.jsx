import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useLoginAdminMutation } from "../../slices/adminsApiSlice";
import { setAdminInfo } from "../../slices/adminAuthSlice";
import { useDispatch } from "react-redux";
import Loader from '../shared/Utilities/Loader';

const AdminLoginPage = () => {
  // local states for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // for dispatching actions
  const dispatch = useDispatch();

  // For navigation
  const navigate = useNavigate();

  // Get admin login mutation
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      // Send login request
      const res = await loginAdmin({ email, password }).unwrap();

      // Set admin info to store
      dispatch(setAdminInfo({ ...res.admin }));

      // Send success toast
      toast.success(res.message);

      // navigate to dashboard
      navigate("/admin/dashboard");
    } catch (error) {

      // Send error toast
      toast.error(error?.data?.error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          {isLoading && <Loader />}
          <h1>Admin Login</h1>
          <Form onSubmit={loginHandler}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              disabled={isLoading}
              variant="dark"
              className="mt-3"
              type="submit"
            >
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLoginPage;
