import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "../../styles/Dashboard.module.css";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import {
  Autocomplete,
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  TextField,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import axios from "axios";
import moment from "moment";
import { AppContext } from "../../utils/AppContext";
import { useSnackbar } from "notistack";
import ReactToPrint from "react-to-print";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

function Home(props) {
  const { currentEstablishment, userInfo } = useSelector((state) => state.auth);
  const { toggleModal, modalOpen } = useContext(AppContext);
  const [appointment, setAppointment] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [action, setAction] = useState("");
  const [motif, setMotif] = useState("");
  const [type, setType] = useState("TOUS");
  const [doctor, setDoctor] = useState("TOUS");
  const [types, setTypes] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [period, setPeriod] = useState({
    startDate: "",
    endDate: "",
  });
  const { startDate, endDate } = { ...period };
  const { enqueueSnackbar } = useSnackbar();
  const componentRef = useRef();
  const isMobile = useMediaQuery("( max-width:900px)");

  const fetchAppointments = async () => {
    const { data } = await axios.post(
      `/appointment/getbyestablishment/${userInfo?._id}/${currentEstablishment?._id}`,
      period
    );
    setAppointments(data);
    setLoading(false);
  };

  const fetchTypes = async () => {
    try {
      const { data } = await axios.post(
        `/type/getbyest/${currentEstablishment._id}`
      );
      setTypes(
        data.map((type) => {
          return { ...type, id: type._id, label: type.name };
        })
      );
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, { variant: "error" });
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.post(
        `/establishments/getbyest/${currentEstablishment._id}`
      );
      setDoctors(
        data.map((doctor) => {
          return { ...doctor, id: doctor._id, label: doctor.user.name };
        })
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const demandCancel = async () => {
    try {
      const { data } = await axios.put(
        `/appointment/cancelDemand/${appointment._id}`,
        { motif: motif }
      );
      fetchAppointments();
      toggleModal();
      enqueueSnackbar(data.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "success" });
    }
  };

  useEffect(() => {
    setLoading(true);
    if (currentEstablishment) fetchAppointments();
    fetchTypes();
    fetchDoctors();
  }, [currentEstablishment]);

  useEffect(() => {
    setLoading(true);
    if (currentEstablishment) fetchAppointments();
  }, [period]);

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
            <h1>annuler ce rendez-vous ?</h1>
            <div className="row">
              <div className="col50 column">
                <p>type: {appointment?.reservation?.type.name}</p>
                <p>docteur: {appointment?.doctor?.user.name}</p>
                <p>status: {appointment?.status}</p>
              </div>
              <div className="col50 column">
                <div style={{ width: "100%" }} className="labeledInput">
                  <label>motif</label>
                  <textarea
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    style={{ width: "80%", height: "120px" }}
                    className="defaultInput"
                    set
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <button
                onClick={() => {
                  demandCancel();
                }}
                className="defaultBtn"
              >
                confirmer
              </button>
              &nbsp;
              <button onClick={() => toggleModal()} className="cancelBtn">
                annuler
              </button>
            </div>
          </div>
        </Fade>
      </Modal>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.row}>
          <h1>rendez-vous : {currentEstablishment?.name}</h1>
          <div className={styles.controls}>
            <div className={styles.mobileVisible} style={{ height: "50px" }}>
              <FilterListIcon
                onClick={() => setFilter(!filter)}
                style={{ cursor: "pointer" }}
                color="primary"
              />
            </div>
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
            <div style={{ height: "50px" }}>
              <Tooltip title="nouveau rendez-vous">
                <Link to="/doctors">
                  <AddIcon style={{ cursor: "pointer" }} color="primary" />
                </Link>
              </Tooltip>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="spinner">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div
              className={
                filter ? `${styles.filter} + ${styles.open}` : styles.filter
              }
            >
              <div className={isMobile ? `${styles.row} + column` : styles.row}>
                <div className={`${styles.mobileVisible} + ${styles.close}`}>
                  <CloseIcon
                    color="fourth"
                    onClick={() => setFilter(!filter)}
                  />
                </div>
                <div
                  style={isMobile ? { width: "60%" } : { width: "22%" }}
                  className="labeledInput"
                >
                  <label>docteurs</label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={doctors}
                    value={
                      doctor === "TOUS"
                        ? ""
                        : doctors.find((d) => d._id === doctor)
                    }
                    onChange={(e, val) => {
                      setDoctor(val === "" || val === null ? "TOUS" : val._id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tous les docteurs"
                        variant="standard"
                      />
                    )}
                  />
                </div>
                <div
                  style={isMobile ? { width: "60%" } : { width: "22%" }}
                  className="labeledInput"
                >
                  <label>types</label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={types}
                    value={
                      type === "TOUS" ? "" : types.find((t) => t.label === type)
                    }
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
                <div
                  style={isMobile ? { width: "60%" } : { width: "22%" }}
                  className="labeledInput"
                >
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
                <div
                  style={isMobile ? { width: "60%" } : { width: "22%" }}
                  className="labeledInput"
                >
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
                {doctor !== "TOUS" ||
                type !== "TOUS" ||
                startDate !== "" ||
                endDate !== "" ? (
                  <Tooltip title="réinitialiser">
                    <RotateLeftIcon
                      onClick={() => {
                        setDoctor("TOUS");
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
            </div>
            <div className={styles.row}>
              <div className={styles.tableContainer}>
                <div ref={componentRef}>
                  <div className="printHeader">
                    <img alt="doctolink" src={"./logo.webp"} />
                    <h1>{currentEstablishment?.name}</h1>
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
                    <table
                      className={
                        isMobile ? "secondaryTableMobile" : "secondaryTable"
                      }
                    >
                      <thead>
                        <tr>
                          <th scope="col">type</th>
                          <th scope="col">docteur</th>
                          <th scope="col">date de début</th>
                          <th scope="col">date fin</th>
                          <th scope="col">status</th>
                          <th scope="col">action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments
                          .filter((appointment) =>
                            type !== "TOUS"
                              ? appointment.reservation.type.name === type
                              : appointment
                          )
                          .filter((appointment) =>
                            doctor !== "TOUS"
                              ? appointment.doctor._id === doctor
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
                                <td data-label="Type">
                                  <span
                                    style={{
                                      padding: "3px",
                                      color: "white",
                                      backgroundColor:
                                        appointment?.reservation?.type?.color,
                                    }}
                                  >
                                    {appointment.reservation?.type.name}
                                  </span>
                                </td>
                                <td data-label="Docteur">
                                  {appointment.doctor?.user.name}
                                </td>
                                <td data-label="Date début">
                                  {moment(appointment.startDate).format(
                                    "yyyy-MM-DD | hh:mm"
                                  )}
                                </td>
                                <td data-label="date de fin">
                                  {moment(appointment.endDate).format(
                                    "yyyy-MM-DD | hh:mm"
                                  )}
                                </td>
                                <td
                                  data-label="status"
                                  style={{
                                    color:
                                      appointment.status === "CONFIRMED"
                                        ? "rgba(45, 203, 6, 1)"
                                        : appointment.status === "WAITING"
                                        ? "rgba(238, 100, 0, 1)"
                                        : appointment.status === "MISSED"
                                        ? "rgba(240, 0, 240, 1)"
                                        : appointment.status === "CANCELED"
                                        ? "rgba(240, 0,0, 1)"
                                        : null,
                                  }}
                                >
                                  {appointment.status}
                                </td>
                                <td data-label="action">
                                  <div
                                    style={{
                                      width: "100%",
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Tooltip title="demand d'annulation">
                                      <EventBusyIcon
                                        style={
                                          appointment.status === "CANCELED" ||
                                          appointment.status === "MISSED" ||
                                          appointment.cancelDemand
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
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Home;
