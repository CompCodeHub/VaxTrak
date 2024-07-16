import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  CartesianGrid,
} from "recharts";
import {
  useGetVaccinatedByAgeGroupQuery,
  useGetVaccinatedByGenderQuery,
  useGetVaccinatedByVaccineTypeQuery,
} from "../../slices/reportsApiSlice";
import { useSelector } from "react-redux";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const data02 = [
  { name: "Group A", value: 2400 },
  { name: "Group B", value: 4567 },
  { name: "Group C", value: 1398 },
];

const AdminReportsPage = () => {
  // Get admin info state
  const { adminInfo } = useSelector((state) => state.adminAuth);

  const { data: vaccinatedByGender } = useGetVaccinatedByGenderQuery({
    hospitalId: adminInfo.hospital,
  });

  const { data: vaccinatedByAgeGroup } = useGetVaccinatedByAgeGroupQuery({
    hospitalId: adminInfo.hospital,
  });

  const { data: vaccinatedByVaccineType } = useGetVaccinatedByVaccineTypeQuery({
    hospitalId: adminInfo.hospital,
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Container className="mt-5">
      <Row>
        <h2>Patients Vaccinated By Gender</h2>
        <Col md={6} xs={12}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vaccinatedByGender?.report}
                cx="50%"
                cy="50%"
                label={renderCustomizedLabel}
                outerRadius={80}
                dataKey="value"
                labelLine={false}
              >
                {vaccinatedByGender?.report.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col md={6} xs={12}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vaccinatedByGender?.report}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {vaccinatedByGender?.report.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>
      <Row className="mt-5">
        <h2>Patients Vaccinated By Age Group</h2>
        <Col md={6} xs={12}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vaccinatedByAgeGroup?.report}
                cx="50%"
                cy="50%"
                label={renderCustomizedLabel}
                outerRadius={80}
                dataKey="value"
                labelLine={false}
              >
                {vaccinatedByAgeGroup?.report.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col md={6} xs={12}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vaccinatedByAgeGroup?.report}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {vaccinatedByAgeGroup?.report.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>
      <Row className="mt-5">
        <h2>Patients Vaccinated By Vaccine Type</h2>
        <Col md={6} xs={12}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vaccinatedByVaccineType?.report}
                cx="50%"
                cy="50%"
                label={renderCustomizedLabel}
                outerRadius={80}
                dataKey="value"
                labelLine={false}
              >
                {vaccinatedByVaccineType?.report.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col md={6} xs={12}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vaccinatedByVaccineType?.report}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {vaccinatedByVaccineType?.report.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Container>
  );
};
export default AdminReportsPage;
