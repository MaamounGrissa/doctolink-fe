import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import styles from "../../../styles/admin/Events.module.css";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import {
  Autocomplete,
  CircularProgress,
  Pagination,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import AddBoxIcon from "@mui/icons-material/AddBox";
import moment from "moment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function Events(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState("TOUS");
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState("TOUS");
  const [sort, setSort] = useState("CREATED_AT");
  const [pagination, setPagination] = useState({
    page: 0,
    count: 0,
  });
  const { page, count } = { ...pagination };
  const [period, setPeriod] = useState({
    startDate: "",
    endDate: "",
  });
  const { startDate, endDate } = { ...period };

  const fetchEvents = async () => {
    var doctorId = null;
    if (userInfo.role === "DOCTOR") doctorId = userInfo._id;
    try {
      const { data } = await axios.post(
        `/event/getbyest/${userInfo.establishment}`,
        { ...period, page: page, doctorId: doctorId }
      );
      setEvents(data.events);
      setPagination({ ...pagination, count: data.count });
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setLoading(false);
    }
  };

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

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/doctor/getAll/${userInfo.establishment}`
      );
      setDoctors(
        data.map((doctor) => {
          return { ...doctor, id: doctor._id, label: doctor.user.name };
        })
      );
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchEvents();
  }, [period, page]);

  useEffect(() => {
    fetchPatients();
    if (userInfo.role !== "DOCTOR") fetchDoctors();
  }, []);

  return (
    <>
      <Layout>
        <div style={{ marginTop: "-120px" }} className={styles.container}>
          <div className={styles.row}>
            <h1>journal des événements </h1>
            <div className={styles.controls}>
              <button
                onClick={() => {
                  setSort("EVENT_DATE");
                }}
                className={sort === "EVENT_DATE" ? "activeBtn" : "defaultBtn"}
              >
                date de rendez-vous
              </button>
              &nbsp;
              <button
                onClick={() => setSort("CREATED_AT")}
                className={sort === "CREATED_AT" ? "activeBtn" : "defaultBtn"}
              >
                date d&apos;évènement
              </button>
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
            {userInfo.role !== "DOCTOR" ? (
              <div style={{ width: "22%" }} className="labeledInput">
                <label>docteur</label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={doctors}
                  value={
                    doctor === "TOUS"
                      ? ""
                      : doctors.find((d) => d._id === doctor)
                  }
                  sx={{ width: "100%", height: "71px" }}
                  onChange={(e, val) => {
                    setDoctor(val === "" || val === null ? "TOUS" : val._id);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tous les docteur"
                      variant="standard"
                    />
                  )}
                />
              </div>
            ) : null}
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
            doctor !== "TOUS" ||
            startDate !== "" ||
            endDate !== "" ? (
              <Tooltip title="réinitialiser">
                <RotateLeftIcon
                  onClick={() => {
                    setPatient("TOUS");
                    setDoctor("TOUS");
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
          <div className={styles.row + "column"}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Pagination
                onChange={(e, page) => {
                  setPagination({ ...pagination, page: page - 1 });
                }}
                count={count}
                page={page + 1}
                variant="outlined"
                color="primary"
              />
            </div>
            <br />
            <div className={styles.tableContainer}>
              {loading ? (
                <div className="spinner">
                  <CircularProgress />
                </div>
              ) : (
                <table className="thirdTable">
                  <thead>
                    <tr>
                      <th>type</th>
                      <th>date de modification</th>
                      <th>date</th>
                      <th>patient</th>
                      <th>docteur</th>
                      <th>consultation</th>
                      <th>acteur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events
                      .filter((event) =>
                        patient !== "TOUS"
                          ? event.appointment.patient._id === patient
                          : event
                      )
                      .filter((event) =>
                        doctor !== "TOUS"
                          ? event.appointment.doctor._id === doctor
                          : event
                      )
                      .sort((a, b) =>
                        sort === "EVENT_DATE"
                          ? a.startDate > b.startDate
                            ? -1
                            : 1
                          : a.createdAt > b.createdAt
                          ? -1
                          : 1
                      )
                      .map((event) => {
                        return (
                          <Tooltip
                            key={event._id}
                            title={
                              event.motif
                                ? event.motif
                                : event.appointment?.notes
                            }
                          >
                            <tr style={{ cursor: "pointer" }} key={event._id}>
                              <td>
                                {event.type === "CANCEL" ? (
                                  <DeleteOutlineIcon color="fourth" />
                                ) : event.type === "ADD" ? (
                                  <AddBoxIcon color="third" />
                                ) : event.type === "EDIT" ? (
                                  <EditIcon style={{ color: "#F5CC18" }} />
                                ) : event.type === "POSPONE" ? (
                                  <PublishedWithChangesIcon color="primary" />
                                ) : null}
                              </td>
                              <td>
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {moment(event.createdAt).format("yyyy-MM-DD")}
                                  &nbsp;
                                  <AccessTimeIcon
                                    fontSize="small"
                                    color="primary"
                                  />
                                  &nbsp;
                                  {moment(event.createdAt).format("hh:mm")}
                                </div>
                              </td>
                              <td>
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {moment(event.startDate).format(
                                    "yyyy-MM-DD "
                                  )}
                                  &nbsp;
                                  <AccessTimeIcon
                                    fontSize="small"
                                    color="primary"
                                  />
                                  &nbsp;
                                  {moment(event.startDate).format("hh:mm")}
                                </div>
                              </td>
                              <td>{event.appointment?.patient?.user.name}</td>
                              <td>{event.appointment?.doctor.user.name}</td>
                              <td>
                                <span
                                  style={{
                                    color: "white",
                                    backgroundColor:
                                      event.appointment?.reservation.type.color,
                                    padding: "3px",
                                    borderRadius: "3px",
                                  }}
                                >
                                  {event.appointment?.reservation.type.name}
                                </span>
                              </td>
                              <td>{event.createdBy?.name}</td>
                            </tr>
                          </Tooltip>
                        );
                      })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Events;
