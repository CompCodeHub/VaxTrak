import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useRegisterUserMutation } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

const UserRegisterPage = () => {
  // local states for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(1);
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [contact, setContact] = useState("");
  const [profession, setProfession] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [medicalConditionInput, setMedicalConditionInput] = useState("");

  const handleAddMedicalCondition = () => {
    console.log("Adding: ", medicalConditionInput);
    const trimmedMedicalCondition = medicalConditionInput.trim();
    if (
      trimmedMedicalCondition &&
      !medicalConditions.includes(trimmedMedicalCondition)
    ) {
      setMedicalConditions((prevConditions) => [
        ...prevConditions,
        trimmedMedicalCondition,
      ]);
      setMedicalConditionInput(""); // Clear input immediately after adding
    }
    console.log("After Adding", medicalConditions);
  };

  useEffect(() => {
    console.log("Updated medical conditions:", medicalConditions);
  }, [medicalConditions]);

  const handleRemoveMedicalCondition = (index) => {
    setMedicalConditions(medicalConditions.filter((_, i) => i !== index));
  };

  // register user mutation
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleUserRegister = async (e) => {
    e.preventDefault();

    // Create user object
    const user = {
      firstName,
      lastName,
      dob,
      gender,
      age,
      bloodGroup,
      contact,
      profession,
      address,
      email,
      password,
      existingMedicalConditions: medicalConditions,
    };

    // Send register request
    try {
      const res = await registerUser(user).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6} xs={12}>
          <h1>Register</h1>
          <p>Register for an account to get started</p>
          <Form onSubmit={handleUserRegister}>
            <Row>
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    placeholder="Enter first name"
                  />
                </Form.Group>
              </Col>
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    placeholder="Enter last name"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Date Of Birth</Form.Label>
                  <Form.Control
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    type="date"
                    placeholder="Enter date of birth"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    type="number"
                    placeholder="Enter age"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Blood Group</Form.Label>
                  <Form.Select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    type="text"
                    placeholder="Enter contact"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Profession</Form.Label>
                  <Form.Control
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    type="text"
                    placeholder="Enter profession"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Existing Medical Conditions</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter medical conditions"
                value={medicalConditionInput}
                onChange={(e) => setMedicalConditionInput(e.target.value)}
              />
              <Button
                variant="outline-dark"
                onClick={handleAddMedicalCondition}
                className="mt-2"
                size="sm"
              >
                Add Medical Condition
              </Button>
              <div className="mt-3">
                {medicalConditions.map((condition, index) => (
                  <Badge
                    key={index}
                    bg="secondary"
                    pill
                    className="me-2 mb-2"
                    onClick={() => handleRemoveMedicalCondition(index)}
                  >
                    {condition} &times;
                  </Badge>
                ))}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                placeholder="Enter address"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Button variant="outline-dark" className="mt-3" type="submit">
              Register
            </Button>
          </Form>
          <p className="mt-3">
            Already a user?
            <Link className="text-dark" to={"/user/login"}>
              Log In
            </Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};
export default UserRegisterPage;
