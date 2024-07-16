import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import HospitalSearchComponent from "../hospital/components/HospitalSearchComponent";
import HospitalCardComponent from "../hospital/components/HospitalCardComponent";
import {
  hospitalsApiSlice,
  useGetAllHospitalsQuery,
} from "../../slices/hospitalsApiSlice";
import Loader from "../shared/Utilities/Loader";
import {
  useGetAvailableAppointmentsQuery,
  useMakeAppointmentMutation,
} from "../../slices/appointmentsApiSlice";
import { toast } from "react-toastify";
import {
  useLazyGetVaccinationReportQuery,
  usersApiSlice,
} from "../../slices/usersApiSlice";

const UserDashboardPage = () => {
  // function to filter timeslots according to current time
  const filterTimeSlots = (dateString, availableSlots) => {
    const currentDate = new Date();

    // Parse the passed date in EST
    const passedDate = new Date(`${dateString}T00:00:00-05:00`);

    // Check if the passed date is the current date in EST
    if (
      passedDate.getFullYear() === currentDate.getFullYear() &&
      passedDate.getMonth() === currentDate.getMonth() &&
      passedDate.getDate() === currentDate.getDate()
    ) {
      // Get the current time in hours and minutes in EST
      const currentHours = currentDate.getHours();
      const currentMinutes = currentDate.getMinutes();

      // Function to convert slot time to minutes
      function timeToMinutes(time) {
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) {
          hours += 12;
        } else if (modifier === "AM" && hours === 12) {
          hours = 0;
        }
        return hours * 60 + minutes;
      }

      // Get the current time in minutes
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;

      // Filter the slots
      availableSlots = availableSlots.filter((slot) => {
        return timeToMinutes(slot) > currentTimeInMinutes;
      });
    }

    return availableSlots;
  };

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

  // local state for date filtering in modal
  const [date, setDate] = useState(getCurrentLocalDate());

  // local state for modal
  const [show, setShow] = useState(false);
  const [currentHospital, setCurrentHospital] = useState(null);
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedVaccine, setSelectedVaccine] = useState("");

  // Fetch hospitals
  const { isLoading, data: hospitalsData, isError } = useGetAllHospitalsQuery();

  // Fetch available appointment slots
  const { data: appointmentSlotsData } = useGetAvailableAppointmentsQuery({
    date,
    hospitalId: currentHospital?._id,
  });

  useEffect(() => {
    if (appointmentSlotsData && appointmentSlotsData.availableSlots) {
      setAppointmentSlots(
        filterTimeSlots(date, appointmentSlotsData.availableSlots)
      );
    }
  }, [appointmentSlotsData, date]);

  const handleOpenModal = (hospital_id) => {
    // Open Modal
    setShow(true);

    // Find selected hospital
    const selectedHospital = hospitalsData.hospitals.find(
      (hospital) => hospital._id === hospital_id
    );
    setCurrentHospital(selectedHospital);
    setSelectedVaccine(selectedHospital.vaccines[0]._id);
  };

  const handleCloseModal = () => {
    // reset form states
    setShow(false);
    setSelectedTimeSlot("");
    setSelectedVaccine("");
  };

  // Get access to userInfo from state
  const { userInfo } = useSelector((state) => state.userAuth);

  // make appointment mutation
  const [makeAppointment] = useMakeAppointmentMutation();

  // handles making appointment
  const handleMakeAppointment = async () => {
    try {
      const res = await makeAppointment({
        userId: userInfo._id,
        hospitalId: currentHospital._id,
        date,
        time: selectedTimeSlot,
        vaccineId: selectedVaccine,
      }).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.error);
    }

    handleCloseModal();
  };

  const [triggerDownload, { isFetching }] = useLazyGetVaccinationReportQuery();

  const handleDownloadReport = async () => {
    try {
      const response = await triggerDownload().unwrap();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "vaccination_report.pdf"); // Adjust file name as needed
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col>
          <h1>Available Hospitals</h1>
        </Col>
        <Col md={3}>
          <Button
            variant="outline-dark"
            onClick={handleDownloadReport}
            disabled={isFetching}
          >
            {isFetching ? "Downloading..." : "Download Report"}
          </Button>
        </Col>
      </Row>
      <HospitalSearchComponent />
      <Row className="justify-content-md-center">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Alert variant="danger">Error Fetching List of Hospitals</Alert>
        ) : (
          hospitalsData.hospitals.length > 0 &&
          hospitalsData.hospitals?.map((hospital) => (
            <Col md={3} sm={6} className="mt-4 me-4" key={hospital._id}>
              <HospitalCardComponent
                hospital={hospital}
                openModal={handleOpenModal}
              />
            </Col>
          ))
        )}
      </Row>

      {/* Make Appointment Modal */}
      <Modal show={show} centered onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Make Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label>Select Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={getCurrentLocalDate()}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <h5>Available Slots</h5>
              {appointmentSlots.length > 0 ? (
                appointmentSlots.map((slot, index) => (
                  <Button
                    className={
                      selectedTimeSlot === slot
                        ? "m-1 btn btn-dark text-white"
                        : "m-1"
                    }
                    variant="outline-dark"
                    key={index}
                    onClick={() => setSelectedTimeSlot(slot)}
                  >
                    {slot}
                  </Button>
                ))
              ) : (
                <Alert variant="warning">No Available Slots</Alert>
              )}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Form>
                <Form.Label>Select Vaccine</Form.Label>
                <Form.Select
                  value={selectedVaccine}
                  onChange={(e) => setSelectedVaccine(e.target.value)}
                >
                  {currentHospital?.vaccines.map((vaccine) => (
                    <option value={`${vaccine._id}`} key={vaccine._id}>
                      {vaccine.name} ({vaccine.company})
                    </option>
                  ))}
                </Form.Select>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={handleMakeAppointment}>
            Make Appointment
          </Button>
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
export default UserDashboardPage;
