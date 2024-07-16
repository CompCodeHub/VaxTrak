import { useSelector } from 'react-redux';
import React from "react";
import { useGetAllVaccinesQuery } from "../../../slices/vaccinesApiSlice";
import { Alert, Button, Table } from "react-bootstrap";
import Loader from "../../shared/Utilities/Loader";
import { useAddVaccineMutation } from "../../../slices/hospitalsApiSlice";
import { toast } from "react-toastify";

const AvailableVaccinesComponent = () => {
  // Query all vaccines
  const {
    data: vaccineData,
    isLoading: loadingVaccines,
    error: errorVaccines,
  } = useGetAllVaccinesQuery();

  // Get access to admin auth state
  const { adminInfo } = useSelector((state) => state.adminAuth);

  // Mutation to add vaccine
  const [addVaccine, { isLoading }] = useAddVaccineMutation();

  // Handles making a vaccine available for hospital
  const makeAvailableHandler = async (vaccineId) => {
    try {
      const res = await addVaccine({
        hospitalId: adminInfo.hospital,
        vaccineId,
      }).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.error);
    }
  };

  return (
    <>
      <h2>All Available Vaccines</h2>
      {loadingVaccines ? (
        <Loader />
      ) : errorVaccines ? (
        <Alert variant="danger">Couldn't Fetch Available Vaccines</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Vaccine Name</th>
              <th>Description</th>
              <th>Company</th>
              <th>Side Effects</th>
              <th>Doses Required</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vaccineData.vaccines && vaccineData.vaccines.length > 0 ? (
              vaccineData.vaccines.map((vaccine) => (
                <tr key={vaccine._id}>
                  <td>{vaccine.name}</td>
                  <td>{vaccine.description}</td>
                  <td>{vaccine.company}</td>
                  <td>{vaccine.sideEffects.join(", ")}</td>
                  <td>{vaccine.dosesRequired}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-dark"
                      onClick={() => makeAvailableHandler(vaccine._id)}
                    >
                      Make Available
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} align="center">
                  No Vaccines Found!
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};
export default AvailableVaccinesComponent;
