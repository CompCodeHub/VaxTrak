import React, { useState } from "react";
import { useCreateVaccineMutation } from "../../../slices/vaccinesApiSlice";
import { toast } from "react-toastify";
import { Alert, Badge, Button, Form, Modal } from "react-bootstrap";
import Loader from "../../shared/Utilities/Loader";

const AddVaccineModal = () => {
  // states for vaccine form
  const [vaccineName, setVaccineName] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [sideEffects, setSideEffects] = useState([]);
  const [sideEffectInput, setSideEffectInput] = useState("");
  const [dosesRequired, setDosesRequired] = useState(1);

  const handleAddSideEffect = () => {
    const trimmedSideEffect = sideEffectInput.trim();
    if (trimmedSideEffect && !sideEffects.includes(trimmedSideEffect)) {
      setSideEffects([...sideEffects, trimmedSideEffect]);
      setSideEffectInput("");
    }
  };

  const handleRemoveSideEffect = (index) => {
    setSideEffects(sideEffects.filter((_, i) => i !== index));
  };

  // Handles submission of create vaccine
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create vaccine object
    const vaccine = {
      name: vaccineName,
      description,
      company,
      sideEffects,
      dosesRequired,
    };

    // Send vaccine object to server
    try {
      const res = await createVaccine(vaccine).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.error);
    }

    // Reset states
    setVaccineName("");
    setDescription("");
    setCompany("");
    setSideEffects([]);
    setDosesRequired(1);
    setShow(false);
  };

  // state for modal
  const [show, setShow] = useState(false);

  // Create vaccine mutation
  const [
    createVaccine,
    { isLoading: loadingCreateVaccine, error: errorCreateVaccine },
  ] = useCreateVaccineMutation();
  return (
    <>
      <Button variant="outline-dark" onClick={() => setShow(true)}>
        Add New Vaccine
      </Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Vaccine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingCreateVaccine && <Loader />}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Vaccine Name</Form.Label>
              <Form.Control
                value={vaccineName}
                onChange={(e) => setVaccineName(e.target.value)}
                type="text"
                placeholder="Enter Vaccine Name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Enter Description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                type="text"
                placeholder="Enter Company"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Side Effects</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Side Effect"
                value={sideEffectInput}
                onChange={(e) => setSideEffectInput(e.target.value)}
              />
              <Button
                variant="outline-dark"
                onClick={handleAddSideEffect}
                className="mt-2"
                size="sm"
              >
                Add Side Effect
              </Button>
              <div className="mt-3">
                {sideEffects.map((sideEffect, index) => (
                  <Badge
                    key={index}
                    pill
                    bg="secondary"
                    className="me-2"
                    onClick={() => handleRemoveSideEffect(index)}
                    style={{ cursor: "pointer" }}
                  >
                    {sideEffect} &times;
                  </Badge>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Doses Required</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Doses Required"
                value={dosesRequired}
                onChange={(e) => setDosesRequired(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="outline-dark" onClick={handleSubmit}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddVaccineModal;
