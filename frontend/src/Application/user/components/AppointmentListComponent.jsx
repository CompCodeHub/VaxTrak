import { toast } from "react-toastify";
import React, { useState } from "react";
import { Alert, Badge, Button, Col, Form, Row, Table } from "react-bootstrap";
import {
  useCancelAppointmentMutation,
  useGetUserAppointmentsByDateQuery,
} from "../../../slices/appointmentsApiSlice";
import { useSelector } from "react-redux";
import Loader from "../../shared/Utilities/Loader";

const AppointmentListComponent = () => {
  // function to get current local date
  const getCurrentLocalDate = () => {
    const currentDate = new Date();

    const offset = currentDate.getTimezoneOffset();
    currentDate.setMinutes(currentDate.getMinutes() - offset);

    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [cancelAppointment] = useCancelAppointmentMutation();

  // local state for date
  const [date, setDate] = useState(getCurrentLocalDate());

  // Get user auth state
  const { userInfo } = useSelector((state) => state.userAuth);

  // Query user appointments
  const { isLoading, isError, data } = useGetUserAppointmentsByDateQuery({
    userId: userInfo._id,
    date,
  });

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const res = await cancelAppointment(appointmentId).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.error);
    }
  };

  return (
    <>
      <Row className="mt-5">
        <Col md={3}>
          <Form>
            <Form.Group>
              <Form.Label>Select Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>

      <Table striped bordered hover className="mt-5">
        <thead>
          <tr>
            <th>Hospital</th>
            <th>Vaccine</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Charges</th>
            <th>Actions</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Alert variant="danger">Error in fetching appointments</Alert>
          ) : data.appointments.length > 0 ? (
            data.appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.hospital.name}</td>
                <td>
                  {appointment.vaccine.name} ({appointment.vaccine.company})
                </td>
                <td>{appointment.date.split("T")[0]}</td>
                <td>{appointment.time}</td>
                <td>
                  {appointment.status === "Scheduled" ? (
                    <Badge bg="secondary">{appointment.status}</Badge>
                  ) : appointment.status === "Completed" ||
                    appointment.status === "Confirmed" ? (
                    <Badge bg="success">{appointment.status}</Badge>
                  ) : (
                    <Badge bg="danger">{appointment.status}</Badge>
                  )}
                </td>
                <td>{appointment.charges}</td>
                <td>
                  {appointment.status !== "Cancelled" && appointment.status !== "Completed" ? (
                    <Button
                      variant="outline-dark"
                      onClick={() => handleCancelAppointment(appointment._id)}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <>No Actions Available!</>
                  )}
                </td>
                <td>
                  {appointment.status !== "Cancelled" &&
                  appointment.paid === false &&
                  appointment.charges !== 0 ? (
                    <Button variant="outline-dark">Pay Now</Button>
                  ) : (
                    <>N/A</>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};
export default AppointmentListComponent;
