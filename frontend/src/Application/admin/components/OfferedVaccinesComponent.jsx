import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import React, { useMemo } from "react";
import {
  useGetHospitalQuery,
  useRemoveVaccineMutation,
} from "../../../slices/hospitalsApiSlice";
import Loader from "../../shared/Utilities/Loader";
import { Alert, Button, Table } from "react-bootstrap";
import { useGetAllVaccinesQuery } from "../../../slices/vaccinesApiSlice";

const OfferedVaccinesComponent = () => {
  // Get access to admin auth state
  const { adminInfo } = useSelector((state) => state.adminAuth);

  // Query hospital data with admin's hospital id
  const {
    data: hospitalData,
    isLoading: hospitalLoading,
    error: hospitalError,
  } = useGetHospitalQuery(adminInfo.hospital);

  // Query available vaccines
  const { data: vaccineData } = useGetAllVaccinesQuery();

  // Get access to remove vaccine mutation
  const [removeVaccine] = useRemoveVaccineMutation();

  const removeVaccineHandler = async (vaccineId) => {
    try {
      const res = await removeVaccine({
        hospitalId: adminInfo.hospital,
        vaccineId,
      }).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.error);
    }
  };

  // Memoized mapping function to map vaccine IDs to vaccine objects
  const mappedVaccines = useMemo(() => {
    if (!hospitalData || !vaccineData) return [];

    const hospitalVaccineIds = hospitalData.hospital.vaccines;
    const allVaccines = vaccineData.vaccines;

    // Map hospital vaccine IDs to vaccine objects
    return hospitalVaccineIds.map((vaccineId) =>
      allVaccines.find((vaccine) => vaccine._id === vaccineId)
    );
  }, [hospitalData, vaccineData]);

  return (
    <>
      <h2>Offered Vaccines</h2>
      {hospitalLoading ? (
        <Loader />
      ) : hospitalError ? (
        <Alert variant="danger">Error Fetching Available Vaccines</Alert>
      ) : (
        <Table striped hover bordered>
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
            {mappedVaccines.length > 0 ? (
              mappedVaccines.map((vaccine) => (
                <tr key={vaccine._id}>
                  <td>{vaccine.name}</td>
                  <td>{vaccine.description}</td>
                  <td>{vaccine.company}</td>
                  <td>{vaccine.sideEffects.join(", ")}</td>
                  <td>{vaccine.dosesRequired}</td>
                  <td>
                    <Button
                      variant="outline-dark"
                      onClick={() => removeVaccineHandler(vaccine._id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} align="center">
                  No Vaccines Offered at your hospital!
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OfferedVaccinesComponent;
