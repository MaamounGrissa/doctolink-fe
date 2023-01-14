import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientHome from "./pages/patient/Dashboard";
import SuperAdminHome from "./pages/superadmin/Home";
import AdminHome from "./pages/admin/dashboard/Home";
import { Route, Navigate } from "react-router-dom";
import Establishment from "./pages/superadmin/Establishment";
import Agenda from "./pages/admin/agenda/Agenda";
import Appointments from "./pages/admin/appointment/Appointments";
import Patients from "./pages/admin/patients/Patients";
import Events from "./pages/admin/events/Events";
import Messenger from "./pages/admin/messenger/Messenger";
import PatientMessenger from "./pages/patient/Messenger";
import ConfigHome from "./pages/admin/configuration/ConfigHome";
import ConfigTypes from "./pages/admin/configuration/ConfigTypes";
import AdminProfile from "./pages/admin/Profile";
import PatientProfile from "./pages/patient/PatientProfile";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Doctors from "./pages/Doctors";
import DoctorCalendar from "./pages/DoctorCalendar";
import Demands from "./pages/admin/demands/Demands";

export const superAdminRoutes = (
  <>
    <Route path="/" element={<SuperAdminHome />} />
    <Route path="/establishment/:id" element={<Establishment />} />
    <Route path="/admin-space" element={<AdminHome />} />
    <Route path="/agenda" element={<Agenda />} />
    <Route path="/appointments" element={<Appointments />} />
    <Route path="/patients" element={<Patients />} />
    <Route path="/demands" element={<Demands />} />
    <Route path="/events" element={<Events />} />
    <Route path="/messenger" element={<Messenger />} />
    <Route path="/config" element={<ConfigHome />} />
    <Route path="/config/types" element={<ConfigTypes />} />
    <Route path="/profile" element={<AdminProfile />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </>
);
export const adminRoutes = (
  <>
    <Route path="/" element={<AdminHome />} />
    <Route path="/agenda" element={<Agenda />} />
    <Route path="/appointments" element={<Appointments />} />
    <Route path="/patients" element={<Patients />} />
    <Route path="/demands" element={<Demands />} />
    <Route path="/events" element={<Events />} />
    <Route path="/messenger" element={<Messenger />} />
    <Route path="/config" element={<ConfigHome />} />
    <Route path="/config/types" element={<ConfigTypes />} />
    <Route path="/profile" element={<AdminProfile />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </>
);

export const doctorRoutes = (
  <>
    <Route path="/" element={<AdminHome />} />
    <Route path="/agenda" element={<Agenda />} />
    <Route path="/appointments" element={<Appointments />} />
    <Route path="/patients" element={<Patients />} />
    <Route path="/demands" element={<Demands />} />
    <Route path="/events" element={<Events />} />
    <Route path="/messenger" element={<Messenger />} />
    <Route path="/config" element={<ConfigHome />} />
    <Route path="/config/types" element={<ConfigTypes />} />
    <Route path="/profile" element={<AdminProfile />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </>
);

export const patientRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<PatientHome />} />
    <Route path="/profile" element={<PatientProfile />} />
    <Route path="/doctors" element={<Doctors />} />
    <Route path="/doctors/calendar/:id" element={<DoctorCalendar />} />{" "}
    <Route path="/messenger" element={<PatientMessenger />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </>
);

export const disconnectedRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:email/:token" element={<ResetPassword />} />
    <Route path="/doctors" element={<Doctors />} />
    <Route path="/doctors/calendar/:id" element={<DoctorCalendar />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </>
);
