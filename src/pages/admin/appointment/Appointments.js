import React, { useContext, useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import styles from "../../../styles/admin/Appointments.module.css";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import {
  Backdrop,
  Badge,
  CircularProgress,
  Fade,
  Modal,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import DeselectIcon from "@mui/icons-material/Deselect";
import ModifyAppointment from "./components/ModifyAppointment";
import { AppContext } from "../../../utils/AppContext";
import DeleteAppointment from "../agenda/components/DeleteAppointment";
import DeleteAppointments from "./components/DeleteAppointments";
import ReactToPrint from "react-to-print";

function Appointments(props) {
  const { currentDoctor, userInfo, demandsCount, cancelsCount } = useSelector(
    (state) => state.auth
  );
  const { modalOpen, toggleModal } = useContext(AppContext);
  const [selected, setSelected] = useState([]);
  const [action, setAction] = useState("");
  const [appointment, setAppointment] = useState({});
  const [canceled, setCanceled] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState("TOUS");
  const [types, setTypes] = useState([]);
  const [type, setType] = useState("TOUS");
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();

  const [period, setPeriod] = useState({
    startDate: "",
    endDate: "",
  });
  const { startDate, endDate } = { ...period };

  const { enqueueSnackbar } = useSnackbar();

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/patient/getAll/${userInfo.establishment}`
      );
      setPatients(
        data.map((patient) => {
          return { ...patient, id: patient._id, label: patient.user.name };
        })
      );
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const fetchTypes = async () => {
    try {
      const { data } = await axios.post(
        `/type/getbyest/${userInfo.establishment}`
      );
      setTypes(
        data.map((type) => {
          return { ...type, id: type._id, label: type.name };
        })
      );
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const fetchAppointments = async () => {
    var doctorId = null;
    setLoading(true);
    if (userInfo.role === "DOCTOR") {
      doctorId = userInfo._id;
    }
    try {
      const { data } = await axios.post(
        `/appointment/getbydoctorperiod/${currentDoctor._id}`,
        { ...period, doctorId: doctorId }
      );
      setAppointments(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
    fetchPatients();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [startDate, endDate, currentDoctor]);

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={toggleModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <div
            className={
              modalOpen
                ? action === "ADD_APPOINTMENT" ||
                  action === "MODIFY_APPOINTMENT"
                  ? "modal big open"
                  : "modal small open"
                : "modal small"
            }
          >
            {action === "MODIFY_APPOINTMENT" ? (
              <ModifyAppointment
                calendar={{ _id: appointment.calendar }}
                appointment={appointment}
                patients={patients}
                userInfo={userInfo}
                currentDoctor={currentDoctor}
                types={types}
                fetchAppointments={fetchAppointments}
              />
            ) : action === "CANCEL_APPOINTMENT" ? (
              <DeleteAppointment
                appointment={appointment}
                fetchAppointments={fetchAppointments}
              />
            ) : action === "CANCEL_APPOINTMENTS" ? (
              <DeleteAppointments
                setSelected={setSelected}
                appointments={selected}
                fetchAppointments={fetchAppointments}
              />
            ) : null}
          </div>
        </Fade>
      </Modal>
      <Layout>
        <div style={{ marginTop: "-120px" }} className={styles.container}>
          <div className={styles.row}>
            <h1>rendez-vous : {currentDoctor?.user?.name}</h1>
            <div className={styles.controls}>
              <div style={{ height: "50px" }}>
                <ReactToPrint
                  trigger={() => (
                    <PrintIcon
                      onClick={() => window.print()}
                      style={{ cursor: "pointer" }}
                      color="primary"
                    />
                  )}
                  content={() => componentRef.current}
                />
              </div>
              &nbsp;&nbsp;
              <div style={{ height: "50px" }}>
                {canceled ? (
                  <Tooltip title="rendez-vous actifs">
                    <UnarchiveIcon
                      onClick={() => {
                        setCanceled(false);
                      }}
                      style={{ cursor: "pointer" }}
                      color="primary"
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="tous les rendez-vous">
                    <ArchiveIcon
                      onClick={() => {
                        setCanceled(true);
                      }}
                      style={{ cursor: "pointer" }}
                      color="primary"
                    />
                  </Tooltip>
                )}
              </div>
              &nbsp;
              <div style={{ height: "50px" }}>
                <Tooltip title="nouveau rendez-vous">
                  <Link to="/agenda">
                    <AddIcon style={{ cursor: "pointer" }} color="primary" />
                  </Link>
                </Tooltip>
              </div>
              &nbsp;
              <div style={{ height: "50px", paddingRight: "50px" }}>
                <Link to="/demands">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                    }}
                  >
                    <Badge
                      style={{ color: "white" }}
                      color="third"
                      badgeContent={demandsCount}
                    >
                      <Tooltip title="demandes">
                        <NotificationsIcon
                          style={{ cursor: "pointer" }}
                          color="primary"
                        />
                      </Tooltip>
                    </Badge>
                    <Badge
                      badgeContent={cancelsCount}
                      style={{
                        color: "white",
                        position: "absolute",
                        top: "0px",
                        right: "-22px",
                      }}
                      color="fourth"
                    ></Badge>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div style={{ width: "22%" }} className="labeledInput">
              <label>patient</label>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={patients}
                value={
                  patient === "TOUS"
                    ? ""
                    : patients.find((p) => p._id === patient)
                }
                sx={{ width: "100%", height: "71px" }}
                onChange={(e, val) => {
                  setPatient(val === "" || val === null ? "TOUS" : val._id);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tous les patients"
                    variant="standard"
                  />
                )}
              />
            </div>
            <div style={{ width: "22%" }} className="labeledInput">
              <label>type</label>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={types}
                value={
                  type === "TOUS" ? "" : types.find((t) => t.label === type)
                }
                sx={{ width: "100%", height: "71px" }}
                onChange={(e, val) => {
                  setType(val === "" || val === null ? "TOUS" : val.label);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tous les types"
                    variant="standard"
                  />
                )}
              />
            </div>
            <div style={{ width: "22%" }} className="labeledInput">
              <label>date de début</label>
              <input
                value={startDate}
                onChange={(e) => {
                  setPeriod({
                    ...period,
                    startDate: e.target.value,
                  });
                }}
                className="muiInput"
                type="date"
              />
            </div>
            <div style={{ width: "22%" }} className="labeledInput">
              <label>date de fin</label>
              <input
                value={endDate}
                onChange={(e) => {
                  setPeriod({ ...period, endDate: e.target.value });
                }}
                className="muiInput"
                type="date"
              />
            </div>
            {patient !== "TOUS" ||
            type !== "TOUS" ||
            startDate !== "" ||
            endDate !== "" ? (
              <Tooltip title="réinitialiser">
                <RotateLeftIcon
                  onClick={() => {
                    setPatient("TOUS");
                    setType("TOUS");
                    setPeriod({
                      ...period,
                      startDate: "",
                      endDate: "",
                    });
                  }}
                  style={{ cursor: "pointer", margin: "10px" }}
                  color="secondary"
                />
              </Tooltip>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.row}>
            <div className={styles.tableContainer}>
              {loading ? (
                <div className="spinner">
                  <CircularProgress />
                </div>
              ) : (
                <div ref={componentRef}>
                  <div className="printHeader">
                    <img alt="doctolink" src={"./logo.webp"} />
                    <h1>
                      Rendez-vous{" "}
                      {(period.startDate === moment().format("yyyy-MM-DD") ||
                        period.startDate === "") &&
                      (period.endDate === moment().format("yyyy-MM-DD") ||
                        period.startDate === "")
                        ? "d’aujourd’hui"
                        : `entre ${period.startDate} et ${period.endDate}`}
                    </h1>
                  </div>
                  <div className="printBody">
                    <table className="secondaryTable">
                      <thead>
                        <tr>
                          <th>date</th>
                          <th>heure</th>
                          <th>patient</th>
                          <th>type</th>
                          <th>status</th>
                          <th className="dontprint">actions</th>
                          <th className="dontprint" style={{ zIndex: 10 }}>
                            &nbsp;&nbsp;
                            {selected.length ===
                            appointments
                              .filter(
                                (appointment) =>
                                  appointment.status !== "CANCELED" &&
                                  appointment.status !== "MISSED"
                              )
                              .filter((appointment) =>
                                patient !== "TOUS"
                                  ? appointment.patient._id === patient
                                  : appointment
                              )
                              .filter((appointment) =>
                                type !== "TOUS"
                                  ? appointment.reservation.type.name === type
                                  : appointment
                              ).length ? (
                              <Tooltip title="décocher tous">
                                <Badge>
                                  <DeselectIcon
                                    onClick={() => {
                                      setSelected([]);
                                    }}
                                    style={{ cursor: "pointer" }}
                                  />
                                </Badge>
                              </Tooltip>
                            ) : (
                              <Tooltip title="cocher tous">
                                <Badge>
                                  <SelectAllIcon
                                    onClick={() => {
                                      setSelected(
                                        appointments
                                          .filter(
                                            (appointment) =>
                                              appointment.status !==
                                                "CANCELED" &&
                                              appointment.status !== "MISSED"
                                          )
                                          .filter((appointment) =>
                                            patient !== "TOUS"
                                              ? appointment.patient._id ===
                                                patient
                                              : appointment
                                          )
                                          .filter((appointment) =>
                                            type !== "TOUS"
                                              ? appointment.reservation.type
                                                  .name === type
                                              : appointment
                                          )
                                      );
                                    }}
                                    style={{ cursor: "pointer" }}
                                  />
                                </Badge>
                              </Tooltip>
                            )}
                            &nbsp;
                            <Tooltip title="annuler les rendez-vous">
                              <Badge
                                badgeContent={selected.length}
                                color="fourth"
                                sx={{ color: "white" }}
                              >
                                <EventBusyIcon
                                  onClick={() => {
                                    setAction("CANCEL_APPOINTMENTS");
                                    toggleModal();
                                  }}
                                  style={{ cursor: "pointer" }}
                                  sx={{
                                    opacity: selected.length > 0 ? 1 : 0,
                                  }}
                                  color="primary"
                                />
                              </Badge>
                            </Tooltip>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments
                          .filter((appointment) =>
                            canceled
                              ? appointment.status
                              : appointment.status !== "CANCELED" &&
                                appointment.status !== "MISSED"
                          )
                          .filter((appointment) =>
                            patient !== "TOUS"
                              ? appointment.patient._id === patient
                              : appointment
                          )
                          .filter((appointment) =>
                            type !== "TOUS"
                              ? appointment.reservation.type.name === type
                              : appointment
                          )
                          .sort((a, b) =>
                            a.startDate < b.startDate
                              ? 1
                              : a.startDate > b.startDate
                              ? -1
                              : 0
                          )
                          .map((appointment) => {
                            return (
                              <tr key={appointment._id}>
                                <td>
                                  {moment(appointment.startDate).format(
                                    "yyyy-MM-DD"
                                  )}
                                </td>
                                <td>
                                  {moment(appointment.startDate).format(
                                    "hh:mm"
                                  )}
                                </td>
                                <td>{appointment.patient?.user.name}</td>
                                <td>
                                  <span
                                    style={{
                                      color: "white",
                                      backgroundColor:
                                        appointment?.reservation?.type.color,
                                      padding: "3px",
                                      borderRadius: "3px",
                                    }}
                                  >
                                    {appointment?.reservation?.type.name}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    color:
                                      appointment.status === "CONFIRMED"
                                        ? "#6bee00"
                                        : appointment.status === "WAITING"
                                        ? "#FF6400"
                                        : appointment.status === "CANCELED"
                                        ? "rgb(255, 0, 0)"
                                        : appointment.status === "MISSED"
                                        ? "rgb(240, 0, 240)"
                                        : null,
                                  }}
                                >
                                  {appointment.status}
                                </td>
                                <td className="dontprint">
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      justifyContent: "space-around",
                                    }}
                                  >
                                    <Tooltip title="modifier">
                                      <EditIcon
                                        style={
                                          appointment.status === "CANCELED" ||
                                          appointment.status === "MISSED"
                                            ? {
                                                pointerEvents: "none",
                                                color: "#ccc",
                                              }
                                            : { cursor: "pointer" }
                                        }
                                        color="secondary"
                                        onClick={() => {
                                          setAppointment(appointment);
                                          setAction("MODIFY_APPOINTMENT");
                                          toggleModal();
                                        }}
                                      />
                                    </Tooltip>

                                    <Tooltip title="annuler">
                                      <EventBusyIcon
                                        style={
                                          appointment.status === "CANCELED" ||
                                          appointment.status === "MISSED"
                                            ? {
                                                pointerEvents: "none",
                                                color: "#ccc",
                                              }
                                            : { cursor: "pointer" }
                                        }
                                        color="fourth"
                                        onClick={() => {
                                          setAppointment(appointment);
                                          setAction("CANCEL_APPOINTMENT");
                                          toggleModal();
                                        }}
                                      />
                                    </Tooltip>
                                  </div>
                                </td>
                                <td className="dontprint">
                                  <Checkbox
                                    style={
                                      appointment.status === "CANCELED" ||
                                      appointment.status === "MISSED"
                                        ? {
                                            pointerEvents: "none",
                                            color: "#ccc",
                                          }
                                        : null
                                    }
                                    checked={selected.includes(appointment)}
                                    onClick={(e) => {
                                      if (selected.includes(appointment)) {
                                        setSelected(
                                          selected.filter(
                                            (x) => x !== appointment
                                          )
                                        );
                                      } else {
                                        setSelected([...selected, appointment]);
                                      }
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Appointments;
