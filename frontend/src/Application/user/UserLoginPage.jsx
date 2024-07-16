import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../slices/usersApiSlice";
import Loader from "../shared/Utilities/Loader";
import { setUserInfo } from "../../slices/userAuthSlice";
import { toast } from "react-toastify";

const UserLoginPage = () => {
  // state for user credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // login user mutation
  const [loginUser, { isLoading }] = useLoginUserMutation();

  // for dispatching actions
  const dispatch = useDispatch();

  // for navigation
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      // Send login request
      const res = await loginUser({ email, password }).unwrap();

      // set user credentials
      dispatch(setUserInfo({ ...res.user }));

      // Send success toast
      toast.success(res.message);

      // navigate to user dashboard
      navigate("/user/dashboard");
    } catch (error) {
      // Send error toast
      toast.error(error?.data?.error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6} xs={12}>
          {isLoading && <Loader />}
          <h1>User Login</h1>
          <Form onSubmit={loginHandler}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
              />
            </Form.Group>
            <Button variant="outline-dark" className="mt-3" type="submit">
              Login
            </Button>
          </Form>
          <p className="mt-2">
            New User?{" "}
            <Link className="text-dark" to={"/user/register"}>
              Sign up
            </Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default UserLoginPage;
