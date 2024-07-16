import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import {
  useGetAppointmentsByDateQuery,
  useGetUnapprovedAppointmentsQuery,
  useMarkAppointmentAsCompletedMutation,
} from "../../slices/appointmentsApiSlice";
import { useSelector } from "react-redux";
import Loader from "../shared/Utilities/Loader";
import { toast } from "react-toastify";

const AdminDashboardPage = () => {
  // function to get current local date
  const getCurrentLocalDate = () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // local state for date filtering
  const [date, setDate] = useState(getCurrentLocalDate());

  // Get access to admin auth from redux
  const { adminInfo } = useSelector((state) => state.adminAuth);

  // Fetch Appointments by date
  const { data, isLoading, isError } = useGetAppointmentsByDateQuery({
    date,
    hospitalId: adminInfo.hospital,
  });

  const [markAppointmentAsCompleted] = useMarkAppointmentAsCompletedMutation();

  const handleMarkAppointmentAsCompleted = async (appointmentId) => {
    try {
      const res = await markAppointmentAsCompleted(appointmentId).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.error);
    }
  };

  const { data: unnapprovedAppointmentsData } =
    useGetUnapprovedAppointmentsQuery(adminInfo.hospital);
  useEffect(() => {
    if (
      unnapprovedAppointmentsData &&
      unnapprovedAppointmentsData.appointments &&
      unnapprovedAppointmentsData.appointments.length > 0
    ) {
      toast.success(
        `You have ${unnapprovedAppointmentsData.appointments.length} new appointment(s)! `
      );
    }
  }, [unnapprovedAppointmentsData]);

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <h2>Filter Appointments By Date</h2>
        <Form>
          <Row className="align-items-end">
            <Col md={8}>
              <Form.Group controlId="date">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <Table striped bordered hover className="mt-5">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Vaccine Name</th>
              <th>Appointment Date</th>
              <th>Appointment Time</th>
              <th>Appointment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <Loader />
            ) : data.appointments && data.appointments.length > 0 ? (
              data.appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>
                    {appointment.user.firstName} {appointment.user.lastName}
                  </td>
                  <td>
                    {appointment.vaccine.name} ({appointment.vaccine.company})
                  </td>
                  <td>{appointment.date.split("T")[0]}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <Badge
                      bg={
                        appointment.status === "Scheduled"
                          ? "secondary"
                          : appointment.status === "Cancelled"
                          ? "danger"
                          : "success"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </td>
                  <td>
                    {appointment.status === "Confirmed" ? (
                      <Button
                        variant="outline-dark"
                        onClick={() =>
                          handleMarkAppointmentAsCompleted(appointment._id)
                        }
                      >
                        Mark Completed
                      </Button>
                    ) : appointment.status === "Scheduled" ? (
                      "Needs Approval"
                    ) : (
                      "Completed/Cancelled"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No Appointments Found!
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};
export default AdminDashboardPage;
