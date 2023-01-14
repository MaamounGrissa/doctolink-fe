import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import moment from "moment";
import styles from "../../../../styles/admin/Modal.module.css";
import AddPatient from "./AddPatient";
import PatientHistory from "./PatientHistory";
import ModifyPatient from "./ModifyPatient";

function AddAppointment(props) {
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const [action, setAction] = useState("");
  const [option, setOption] = useState("");
  const [status, setStatus] = useState("");

  const [appointment, setAppointment] = useState({
    establishment: "",
    createdBy: "",
    doctor: "",
    calendar: "",
    reservation: "",
    patient: "",
    startDate: "",
    duration: 0,
    notes: "",
    status: "WAITING", // "WAITING" or "CONFIRMED" or "CANCELED" or "MISSED"
  });
  const addAppointment = async () => {
    if (appointment.patient === "" || appointment.patient === undefined) {
      return enqueueSnackbar("séléctionnez un patient !", {
        variant: "warning",
      });
    }
    try {
      const { data } = await axios.post(`/appointment/add`, appointment);
      setAppointment({
        establishment: "",
        createdBy: "",
        doctor: "",
        calendar: "",
        reservation: "",
        patient: "",
        startDate: "",
        duration: 0,
        notes: "",
        status: "WAITING", // "WAITING" or "CONFIRMED" or "CANCELED" or "MISSED"
      });
      enqueueSnackbar(data.message, { variant: "success" });
      if (props.fetchCalendar) {
        props.fetchCalendar();
        setOption("");
        toggleModal();
      }
      if (props.fetchDemands) {
        props.deleteDemand();
        props.fetchDemands();
        props.setAction("");
        toggleModal();
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  useEffect(() => {
    if (props)
      setAppointment({
        ...appointment,
        establishment: props.userInfo.establishment,
        createdBy: props.userInfo.id,
        doctor: props.currentDoctor._id,
        calendar: props.calendar._id,
        reservation: props.cell._id,
        startDate: props.cell.startDate,
        duration: Math.abs(
          moment(props.cell.endDate).diff(
            moment(props.cell.startDate),
            "minutes"
          )
        ),
      });
    if (props.patient) {
      setAppointment({
        ...appointment,
        establishment: props.userInfo.establishment,
        createdBy: props.userInfo.id,
        doctor: props.currentDoctor._id,
        calendar: props.calendar._id,
        reservation: props.cell._id,
        startDate: props.cell.startDate,
        duration: Math.abs(
          moment(props.cell.endDate).diff(
            moment(props.cell.startDate),
            "minutes"
          )
        ),
        patient: props?.patient?._id,
      });
      setOption({
        ...props.patient,
        id: props.patient._id,
        label: props.patient.user.name,
      });
    }
  }, [props]);

  return (
    <div className={styles.row}>
      <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
        <h1>nouveau rendez-vous</h1>
        <br />
        <div className="row">
          <label>Durée</label>
          <div
            style={{
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
          <input
            value={appointment.duration}
            onChange={(e) => {
              setAppointment({
                ...appointment,
                duration: e.target.value,
              });
            }}
            style={{ width: "70px", marginTop: "-20px" }}
            type="number"
            className="dateInput"
          />
        </div>
        <br />
        <div className="row">
          <Autocomplete
            style={{
              width: "60%",
              padding: "0px",
            }}
            value={option}
            options={props.patients.map((option) => ({
              id: option._id,
              label: option.user.name,
              ...option,
            }))}
            onChange={(e, val) => {
              setOption(val);
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
            value={status}
            options={[
              { id: 0, label: "WAITING" },
              { id: 2, label: "CONFIRMED" },
              { id: 3, label: "MISSED" },
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
          <button
            onClick={() => {
              addAppointment();
            }}
            className="defaultBtn"
          >
            confirmer
          </button>
          &nbsp;
          <button
            onClick={() => {
              if (props.setAction) {
                props.setAction("");
              } else {
                toggleModal();
              }
            }}
            className="cancelBtn"
          >
            annuler
          </button>
        </div>
      </div>
      {action === "ADD_PATIENT" ? (
        <>
          <div className="vr"></div>
          <div className={styles.col50}>
            <AddPatient
              setOption={setOption}
              patient={option}
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
              patient={option}
              calendarId={props.calendar._id}
            />
          </div>
        </>
      ) : appointment.patient !== "" && action === "MODIFY_PATIENT" ? (
        <>
          <div className="vr"></div>
          <div className={styles.col50}>
            <ModifyPatient
              setOption={setOption}
              patient={option}
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

export default AddAppointment;
