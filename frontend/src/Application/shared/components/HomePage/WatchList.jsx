import React from "react";
import { useGetWatchListQuery } from "../../../../slices/reportsApiSlice";
import Loader from "../../Utilities/Loader";
import { Alert, Card, Col, Row } from "react-bootstrap";

const WatchList = () => {
  const { isLoading, data, isError } = useGetWatchListQuery();
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Alert variant="danger">Couldn't Load WatchList</Alert>
      ) : (
        <>
          <Card className="text-center">
            <Card.Body>
              <div>
                <h3>{data.totalVaccinatedUsers}</h3>
                <p>patients vaccinated</p>
              </div>
              <Row>
                {data.genderDistribution.map((item) => (
                  <Col key={item.gender} xs={12} md={4} className="mb-3">
                    <Card>
                      <Card.Body>
                        <Card.Title>{item.gender}</Card.Title>
                        <Card.Text>{item.count}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
};
export default WatchList;
