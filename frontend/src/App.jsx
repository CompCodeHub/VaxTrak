import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainHeader from "./Application/shared/components/Navigation/MainHeader";
import MainFooter from "./Application/shared/components/Navigation/MainFooter";
import NotFoundPage from "./Application/shared/pages/NotFoundPage";
import HomePage from "./Application/shared/pages/HomePage";
import AboutPage from "./Application/shared/pages/AboutPage";
import AdminLoginPage from "./Application/admin/AdminLoginPage";
import { ToastContainer } from "react-toastify";
import AdminDashboardPage from "./Application/admin/AdminDashboardPage";
import { useSelector } from "react-redux";
import AdminRegisterVaccinePage from "./Application/admin/AdminRegisterVaccinePage";
import RegisterHospitalPage from "./Application/hospital/RegisterHospitalPage";
import UserLoginPage from "./Application/user/UserLoginPage";
import UserDashboardPage from "./Application/user/UserDashboardPage";
import UserRegisterPage from "./Application/user/UserRegisterPage";
import UserAppointmentsPage from "./Application/user/UserAppointmentsPage";
import ApproveAppointmentsPage from "./Application/admin/ApproveAppointmentsPage";
import AdminReportsPage from "./Application/admin/AdminReportsPage";

function App() {
  // Get access to admin auth slice
  const { adminInfo } = useSelector((state) => state.adminAuth);

  // Get access to user auth slice
  const { userInfo } = useSelector((state) => state.userAuth);

  return (
    <Router>
      <ToastContainer />
      <MainHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/user/register" element={<UserRegisterPage />} />
          <Route path="/user/login" element={<UserLoginPage />} />
          <Route
            path="/user/dashboard"
            element={
              userInfo ? (
                <UserDashboardPage />
              ) : (
                <Navigate replace to={"/user/login"} />
              )
            }
          />
          <Route
            path="/user/appointments"
            element={
              userInfo ? (
                <UserAppointmentsPage />
              ) : (
                <Navigate replace to={"/user/login"} />
              )
            }
          />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              adminInfo ? (
                <AdminDashboardPage />
              ) : (
                <Navigate replace to={"/admin/login"} />
              )
            }
          />
          <Route
            path="/admin/register-vaccine"
            element={
              adminInfo ? (
                <AdminRegisterVaccinePage />
              ) : (
                <Navigate replace to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/approve"
            element={
              adminInfo ? (
                <ApproveAppointmentsPage />
              ) : (
                <Navigate replace to={"/admin/login"} />
              )
            }
          />
          <Route
            path="/admin/reports"
            element={
              adminInfo ? (
                <AdminReportsPage />
              ) : (
                <Navigate replace to={"/admin/login"} />
              )
            }
          />
          <Route
            path="/hospitals/register"
            element={<RegisterHospitalPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <MainFooter />
    </Router>
  );
}

export default App;
