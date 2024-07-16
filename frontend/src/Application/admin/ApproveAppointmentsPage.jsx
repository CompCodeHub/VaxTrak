import React, { useEffect } from "react";
import { Alert, Button, Col, Container, Row, Table } from "react-bootstrap";
import {
  useCancelAppointmentMutation,
  useGetUnapprovedAppointmentsQuery,
  useApproveAppointmentMutation,
} from "../../slices/appointmentsApiSlice";
import Loader from "../shared/Utilities/Loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ApproveAppointmentsPage = () => {
  // Get access to admin Info
  const { adminInfo } = useSelector((state) => state.adminAuth);

  // Get unnapproved appointments
  const {
    data: appointmentsData,
    isLoading,
    isError,
  } = useGetUnapprovedAppointmentsQuery(adminInfo.hospital);

  const [cancelAppointment] = useCancelAppointmentMutation();
  const [approveAppointment] = useApproveAppointmentMutation();

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const res = await cancelAppointment(appointmentId).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.error);
    }
  };

  const handleApproveAppointment = async (appointmentId) => {
    try {
      const res = await approveAppointment(appointmentId).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.error);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <h1>Approve Appointments</h1>
      </Row>
      <Row className="justify-content-md-center mt-5">
        <Col>
          <Table striped hover bordered>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Vaccine Name</th>
                <th>Appointment Date</th>
                <th>Appointment Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <Loader />
              ) : isError ? (
                <Alert variant="danger">Error fetching appointments</Alert>
              ) : appointmentsData.appointments.length > 0 ? (
                appointmentsData.appointments.map((appointment) => (
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
                      <Button
                        variant="outline-success me-2"
                        onClick={() =>
                          handleApproveAppointment(appointment._id)
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-dark">
                    No appointments to approve!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};
export default ApproveAppointmentsPage;
