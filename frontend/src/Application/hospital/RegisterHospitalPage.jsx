import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useRegisterHospitalMutation } from "../../slices/hospitalsApiSlice";
import { toast } from "react-toastify";
import Loader from "../shared/Utilities/Loader";

const RegisterHospitalPage = () => {
  // local states for form
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [hospitalType, setHospitalType] = useState("Government");
  const [standardVaccineCharges, setStandardVaccineCharges] = useState(0);
  const [image, setImage] = useState("");
  const [contact, setContact] = useState("");
  const [openingTime, setOpeningTime] = useState("09:00");
  const [closingTime, setClosingTime] = useState("16:00");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // register hospital mutation
  const [registerHospital, { isLoading }] = useRegisterHospitalMutation();

  // converts image to base64
  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    let period = "AM";
    hours = parseInt(hours, 10);

    if (hours >= 12) {
      period = "PM";
      if (hours > 12) {
        hours -= 12;
      }
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  };

  const registerHospitalHandler = async (e) => {
    e.preventDefault();

    // Convert time to 12-hour format
    const convertedOpeningTime = convertTo12HourFormat(openingTime);
    const convertedClosingTime = convertTo12HourFormat(closingTime);

    try {
      const res = await registerHospital({
        name: hospitalName,
        address: hospitalAddress,
        type: hospitalType,
        charges: standardVaccineCharges,
        openingTime: convertedOpeningTime,
        closingTime: convertedClosingTime,
        image,
        contact,
        adminFname: firstName,
        adminLname: lastName,
        adminEmail,
        adminPassword,
      }).unwrap();
      toast.success(
        "Hospital Registered! Please login with your admin account!"
      );
    } catch (error) {
      toast.error(error?.data?.error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={9} xs={12}>
          {isLoading && <Loader />}
          <Form onSubmit={registerHospitalHandler}>
            <Row>
              <Col>
                <h1>Register your hospital</h1>
                <Form.Group>
                  <Form.Label>Hospital Name</Form.Label>
                  <Form.Control
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    type="text"
                    placeholder="Enter hospital name"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Hospital Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter hospital address"
                    value={hospitalAddress}
                    onChange={(e) => setHospitalAddress(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Hospital Type</Form.Label>
                  <Form.Select
                    value={hospitalType}
                    onChange={(e) => setHospitalType(e.target.value)}
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                  </Form.Select>
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Charges</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter hospital charges"
                        value={standardVaccineCharges}
                        onChange={(e) =>
                          setStandardVaccineCharges(e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Opens</Form.Label>
                      <Form.Control
                        type="time"
                        placeholder="Enter opening time"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Closes</Form.Label>
                      <Form.Control
                        type="time"
                        placeholder="Enter closing time"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Form.Group>
                    <Form.Label>Hospital Image</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => convertToBase64(e.target.files[0])}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group>
                    <Form.Label>Contact</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter contact number"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </Form.Group>
                </Row>
              </Col>
              <Col>
                <h1>Initial Admin Info</h1>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter admin first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter admin last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Admin Email</Form.Label>
                  <Form.Control
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    type="email"
                    placeholder="Enter admin email"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Admin Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col className="text-center">
                <Button variant="outline-dark" className="mt-3" type="submit">
                  Register
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
export default RegisterHospitalPage;
