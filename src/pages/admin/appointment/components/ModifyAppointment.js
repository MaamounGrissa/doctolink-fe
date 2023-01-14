import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import moment from "moment";
import styles from "../../../../styles/admin/Modal.module.css";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import AddPatient from "../../agenda/components/AddPatient";
import PatientHistory from "../../agenda/components/PatientHistory";
import ModifyPatient from "../../agenda/components/ModifyPatient";
import { useSelector } from "react-redux";

function ModifyAppointment(props) {
  const { toggleModal } = useContext(AppContext);
  const { userInfo } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [typeOption, setTypeOption] = useState("");
  const [patientOption, setPatientOption] = useState("");
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [appointment, setAppointment] = useState({
    establishment: "",
    type: "",
    createdBy: "",
    doctor: "",
    calendar: "",
    reservation: "",
    patient: "",
    startDate: "",
    duration: "",
    notes: "",
    status: "WAITING", // "WAITING" or "CONFIRMED" or "CANCELED"
  });

  const modifyAppointment = async () => {
    setLoading(true);
    if (appointment.patient === "") {
      return (
        setLoading(false),
        enqueueSnackbar("séléctionnez un patient !", {
          variant: "warning",
        })
      );
    }
    try {
      const { data } = await axios.put(`/appointment/modify`, {
        ...appointment,
        createdBy: userInfo.id,
        establishment: userInfo.establishment,
      });
      setAppointment({
        establishment: "",
        type: "",
        createdBy: "",
        doctor: "",
        calendar: "",
        reservation: "",
        patient: "",
        startDate: "",
        duration: "",
        notes: "",
        status: "WAITING", // "WAITING" or "CONFIRMED" or "CANCELED"
      });
      enqueueSnackbar(data.message, { variant: "success" });
      if (props.fetchAppointments) {
        props.fetchAppointments();
      }
      if (props.fetchCalendar) {
        props.fetchCalendar();
      }
      setPatientOption("");
      setTypeOption("");
      setStatus("");
      setLoading(false);
      toggleModal();
    } catch (error) {
      console.log(error);
      setLoading(false);
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  useEffect(() => {
    if (props)
      setAppointment({
        ...props.appointment,
        createdBy: props.appointment.createdBy._id,
        doctor: props.appointment.doctor._id,
        patient: props.appointment.patient._id,
        reservation: props.appointment.reservation._id,
        type: props.appointment.reservation.type._id,
        duration: Math.abs(
          moment(props.appointment.startDate).diff(
            moment(props.appointment.endDate),
            "minutes"
          )
        ),
      });
    setTypeOption({
      id: props.appointment.reservation.type._id,
      label: props.appointment.reservation.type.name,
      ...props.appointment.reservation.type,
    });
    setPatientOption({
      id: props.appointment.patient._id,
      label: props.appointment.patient.user.name,
      ...props.appointment.patient,
    });
    setStatus(props.appointment.status);
  }, [props]);

  return (
    <div className={styles.row}>
      <div style={{ height: "100%", width: "100%", overflowY: "auto" }}>
        <h1>modifier rendez-vous</h1>
        <div className="row">
          <div
            style={{
              marginTop: "-50px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <>
              <AddIcon
                onClick={() => {
                  setAction("ADD_PATIENT");
                }}
                color={action === "ADD_PATIENT" ? "secondary" : "primary"}
                style={{ cursor: "pointer" }}
              />
              &nbsp;&nbsp;
              {appointment.patient !== "" ? (
                <>
                  <HistoryIcon
                    onClick={() => {
                      setAction("HISTORY");
                    }}
                    color={action === "HISTORY" ? "secondary" : "primary"}
                    style={{ cursor: "pointer" }}
                  />
                  &nbsp;&nbsp;
                  <PermIdentityIcon
                    onClick={() => {
                      setAction("MODIFY_PATIENT");
                    }}
                    color={
                      action === "MODIFY_PATIENT" ? "secondary" : "primary"
                    }
                    style={{ cursor: "pointer" }}
                  />
                </>
              ) : (
                <></>
              )}
            </>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="labeledInput">
            <label>Date</label>
            <input
              value={appointment.startDate}
              onChange={(e) => {
                setAppointment({
                  ...appointment,
                  startDate: moment(e.target.value).format("yyyy-MM-DDThh:mm"),
                });
              }}
              type="datetime-local"
              className="dateInput"
            />
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div className="labeledInput">
            <label>Durée</label>
            <input
              value={appointment.duration}
              onChange={(e) => {
                setAppointment({
                  ...appointment,
                  duration: e.target.value,
                });
              }}
              style={{ width: "50px" }}
              type="number"
              className="dateInput"
            />
          </div>
        </div>
        <div className="row">
          <Autocomplete
            style={{
              width: "60%",
              padding: "0px",
            }}
            value={patientOption}
            options={props.patients.map((option) => ({
              id: option._id,
              label: option.user.name,
              ...option,
            }))}
            onChange={(e, val) => {
              setPatientOption(val);
              setAppointment({
                ...appointment,
                patient: val !== null ? val.id : "",
              });
            }}
            renderInput={(params) => (
              <TextField variant="standard" {...params} label="Patient" />
            )}
          />
        </div>
        <div className="row">
          <Autocomplete
            style={{
              width: "60%",
              padding: "0px",
            }}
            value={typeOption}
            options={props.types.map((option) => ({
              id: option._id,
              label: option.name,
              ...option,
            }))}
            onChange={(e, val) => {
              setTypeOption(val);
              setAppointment({
                ...appointment,
                type: val !== null ? val.id : "",
              });
            }}
            renderInput={(params) => (
              <TextField variant="standard" {...params} label="Type" />
            )}
          />
        </div>
        <div className="row">
          <Autocomplete
            style={{
              width: "60%",
              padding: "0px",
            }}
            value={status}
            options={[
              { id: 0, label: "WAITING" },
              { id: 1, label: "CONFIRMED" },
              { id: 2, label: "MISSED" },
            ]}
            onChange={(e, val) => {
              setStatus(val);
              setAppointment({
                ...appointment,
                status: val !== null || val === "" ? val.label : "WAITING",
              });
            }}
            renderInput={(params) => (
              <TextField variant="standard" {...params} label="Status" />
            )}
          />
        </div>
        <div className="row">
          <TextField
            value={appointment.notes}
            onChange={(e) => {
              setAppointment({ ...appointment, notes: e.target.value });
            }}
            multiline
            maxRows={6}
            minRows={3}
            variant="standard"
            className="dateInput"
            style={{
              width: "60%",
              height: "auto",
              padding: "0px",
            }}
            label="Notes"
          />
        </div>
        <br />
        <div className="row">
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <button
                onClick={() => {
                  modifyAppointment();
                }}
                className="defaultBtn"
              >
                confirmer
              </button>
              &nbsp;
              <button
                onClick={() => {
                  toggleModal();
                }}
                className="cancelBtn"
              >
                annuler
              </button>
            </>
          )}
        </div>
      </div>
      {action === "ADD_PATIENT" ? (
        <>
          <div className="vr"></div>
          <div className={styles.col50}>
            <AddPatient
              setTypeOption={setTypeOption}
              setPatientOption={setPatientOption}
              patientOption={patientOption}
              setAction={setAction}
              setAppointment={setAppointment}
              appointment={appointment}
              fetchPatients={props.fetchPatients}
            />
          </div>
        </>
      ) : appointment.patient !== "" && action === "HISTORY" ? (
        <>
          <div className="vr"></div>
          <div className={styles.col50}>
            <PatientHistory
              setAction={setAction}
              patient={patientOption}
              calendarId={props.calendar._id}
            />
          </div>
        </>
      ) : appointment.patient !== "" && action === "MODIFY_PATIENT" ? (
        <>
          <div className="vr"></div>
          <div className={styles.col50}>
            <ModifyPatient
              setPatientOption={setPatientOption}
              patient={patientOption}
              setAction={setAction}
              setAppointment={setAppointment}
              appointment={appointment}
              fetchPatients={props.fetchPatients}
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ModifyAppointment;
