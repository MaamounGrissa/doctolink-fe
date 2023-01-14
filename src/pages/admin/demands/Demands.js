import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import styles from "../../../styles/admin/Demands.module.css";
import {
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  Tooltip,
} from "@mui/material";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import axios from "axios";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { AppContext } from "../../../utils/AppContext";
import DeleteAppointment from "../agenda/components/DeleteAppointment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ApproveAppointment from "./components/ApproveAppointment";

function Demands(props) {
  const { currentDoctor, userInfo } = useSelector((state) => state.auth);
  const { modalOpen, toggleModal } = useContext(AppContext);
  const [action, setAction] = useState("");
  const [sort, setSort] = useState("RDV_DATE");
  const [cancel, setCancel] = useState(false);
  const [demands, setDemands] = useState([]);
  const [cancels, setCancels] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState("TOUS");
  const [type, setType] = useState("TOUS");
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState({});
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

  const fetchDemands = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `/demands/getdemandsbyestperiod/${userInfo?.establishment}`,
        { ...period, doctor: currentDoctor._id }
      );
      setDemands(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setLoading(false);
    }
  };

  const fetchCancels = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `/appointment/getcancelsbydoctorperiod/${currentDoctor._id}`,
        period
      );
      setCancels(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    fetchDemands();
    fetchCancels();
  }, [startDate, endDate, currentDoctor, action]);

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
            style={{ overflowY: "scroll" }}
            className={modalOpen ? "modal small open" : "modal "}
          >
            {action === "CANCEL_APPOINTMENT" ? (
              <DeleteAppointment
                fetchCancels={fetchCancels}
                appointment={appointment}
              />
            ) : action === "APPROVE_APPOINTMENT" ? (
              <ApproveAppointment
                fetchDemands={fetchDemands}
                appointment={appointment}
              />
            ) : null}
          </div>
        </Fade>
      </Modal>
      <Layout>
        <div style={{ marginTop: "-120px" }} className={styles.container}>
          <div className={styles.row}>
            <h1>
              {cancel ? "demandes d'annulation :" : "demandes de rendez-vous :"}{" "}
              {currentDoctor?.user?.name}
            </h1>
            <div className={styles.controls}>
              <div style={{ height: "50px" }}>
                {cancel ? (
                  <Tooltip title="demandes de rendez-vous">
                    <EventNoteIcon
                      onClick={() => {
                        setCancel(false);
                      }}
                      style={{ cursor: "pointer" }}
                      color="primary"
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="demandes d'annulation">
                    <EventBusyIcon
                      onClick={() => {
                        setCancel(true);
                      }}
                      style={{ cursor: "pointer" }}
                      color="primary"
                    />
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
          {cancel && cancels.length > 0 ? (
            <div className={styles.row}>
              <div style={{ width: "20%" }} className="labeledInput">
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
              <div style={{ width: "20%" }} className="labeledInput">
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
              <div style={{ width: "20%" }} className="labeledInput">
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
              <div style={{ width: "30%" }} className="row">
                <div className="labeledInput">
                  <label style={{ marginBottom: "5px" }}>trier par</label>

                  <div className="row">
                    <button
                      onClick={() => {
                        setSort("RDV_DATE");
                      }}
                      className={
                        sort === "RDV_DATE" ? "activeBtn" : "defaultBtn"
                      }
                    >
                      {cancel ? "date d'annulation" : "date de rendez-vous"}
                    </button>
                    &nbsp;
                    <button
                      onClick={() => setSort("DEMAND_DATE")}
                      className={
                        sort === "DEMAND_DATE" ? "activeBtn" : "defaultBtn"
                      }
                    >
                      date de demande
                    </button>
                  </div>
                </div>
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
          ) : !cancel && demands.length > 0 ? (
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
              <div style={{ width: "20%" }} className="labeledInput">
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
              <div style={{ width: "20%" }} className="labeledInput">
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
              <div style={{ width: "30%" }} className="row">
                <div className="labeledInput">
                  <label style={{ marginBottom: "5px" }}>trier par</label>

                  <div className="row">
                    <button
                      onClick={() => {
                        setSort("RDV_DATE");
                      }}
                      className={
                        sort === "RDV_DATE" ? "activeBtn" : "defaultBtn"
                      }
                    >
                      {cancel ? "date d'annulation" : "date de rendez-vous"}
                    </button>
                    &nbsp;
                    <button
                      onClick={() => setSort("DEMAND_DATE")}
                      className={
                        sort === "DEMAND_DATE" ? "activeBtn" : "defaultBtn"
                      }
                    >
                      date de demande
                    </button>
                  </div>
                </div>
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
          ) : null}
          <div className={styles.row}>
            <div className={styles.tableContainer}>
              {loading ? (
                <div className="spinner">
                  <CircularProgress />
                </div>
              ) : cancel ? (
                cancels.length > 0 ? (
                  <div className="tableContainer">
                    <table className="fourthTable">
                      <thead>
                        <tr>
                          <th>patient</th>
                          <th>téléphone</th>
                          <th>date de début</th>
                          <th>date de fin</th>
                          <th>action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cancels
                          .filter((c) =>
                            patient !== "TOUS"
                              ? c.patient._id == patient
                              : patient
                          )
                          .sort((a, b) =>
                            sort === "RDV_DATE"
                              ? a.reservation.startDate >
                                b.reservation.startDate
                                ? 1
                                : -1
                              : a.createdAt > b.createdAt
                              ? -1
                              : 1
                          )
                          .map((cancel) => {
                            return (
                              <Tooltip title={cancel.motif}>
                                <tr
                                  style={{ cursor: "pointer" }}
                                  key={cancel._id}
                                >
                                  <td>{cancel.patient.user.name}</td>
                                  <td>{cancel.patient.user.phone}</td>
                                  <td>
                                    {moment(
                                      cancel.reservation.startDate
                                    ).format("yyyy-MM-DD | hh:mm")}
                                  </td>
                                  <td>
                                    {moment(cancel.reservation.endDate).format(
                                      "yyyy-MM-DD | hh:mm"
                                    )}
                                  </td>
                                  <td>
                                    <Tooltip title="annuler le rendez-vous">
                                      <EventBusyIcon
                                        onClick={() => {
                                          setAction("CANCEL_APPOINTMENT");
                                          setAppointment(cancel);
                                          toggleModal();
                                        }}
                                        style={{ cursor: "pointer" }}
                                        color="fourth"
                                      />
                                    </Tooltip>
                                  </td>
                                </tr>
                              </Tooltip>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <h2>aucune données pour le moment.</h2>
                )
              ) : demands.length > 0 ? (
                <div className="tableContainer">
                  <table className="fifthTable">
                    <thead>
                      <tr>
                        <th>patient</th>
                        <th>téléphone</th>
                        <th>date de début</th>
                        <th>date de fin</th>
                        <th>action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demands
                        .filter((d) =>
                          patient !== "TOUS"
                            ? d.patient._id == patient
                            : patient
                        )
                        .sort((a, b) =>
                          sort === "RDV_DATE"
                            ? a.reservation.startDate > b.reservation.startDate
                              ? 1
                              : -1
                            : a.createdAt > b.createdAt
                            ? -1
                            : 1
                        )
                        .map((demand) => {
                          return (
                            <tr>
                              <td>{demand.patient.user.name}</td>
                              <td>{demand.patient.user.phone}</td>
                              <td>
                                {moment(demand.reservation.startDate).format(
                                  "yyyy-MM-DD | hh:mm"
                                )}
                              </td>
                              <td>
                                {moment(demand.reservation.endDate).format(
                                  "yyyy-MM-DD | hh:mm"
                                )}
                              </td>
                              <td>
                                <Tooltip title="accepter le rendez-vous">
                                  <EventAvailableIcon
                                    onClick={() => {
                                      setAction("APPROVE_APPOINTMENT");
                                      setAppointment(demand);
                                      toggleModal();
                                    }}
                                    style={{ cursor: "pointer" }}
                                    color="third"
                                  />
                                </Tooltip>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <h2>aucune données pour le moment.</h2>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Demands;
