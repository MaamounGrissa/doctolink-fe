import React, { useEffect, useRef, useState } from "react";
import styles from "../../../../styles/admin/Home.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import PrintIcon from "@mui/icons-material/Print";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";

function RdvTable(props) {
  const [filter, setFilter] = useState({ patient: "TOUS", doctor: "TOUS" });
  const { patient, doctor } = { ...filter };
  const { userInfo } = useSelector((state) => state.auth);
  const componentRef = useRef();

  return (
    <section className={styles.rdvContainer}>
      <div className={styles.headerRow}>
        <h3>
          Rendez-vous{" "}
          {props.startDate === moment().format("yyyy-MM-DD") &&
          props.endDate === moment().format("yyyy-MM-DD")
            ? "d’aujourd’hui"
            : `entre ${props.startDate} et ${props.endDate}`}
        </h3>
        <ReactToPrint
          trigger={() => (
            <PrintIcon
              onClick={() => window.print()}
              style={{ cursor: "pointer" }}
              fontSize="large"
              color="primary"
            />
          )}
          content={() => componentRef.current}
        />
      </div>
      <br />
      <div className={styles.inputRow}>
        <div style={{ width: "24%" }} className="labeledInput">
          <label>patient</label>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={props.patients}
            sx={{ width: "100%", height: "71px" }}
            onChange={(e, val) => {
              setFilter({
                ...filter,
                patient: val === "" || val === null ? "TOUS" : val._id,
              });
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
          <div style={{ width: "24%" }} className="labeledInput">
            <label>docteur</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={props.doctors}
              sx={{ width: "100%", height: "71px" }}
              onChange={(e, val) => {
                setFilter({
                  ...filter,
                  doctor: val === "" || val === null ? "TOUS" : val._id,
                });
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
        ) : null}
        <div style={{ width: "24%" }} className="labeledInput">
          <label>date de début</label>
          <input
            value={props.startDate}
            onChange={(e) => {
              props.setPeriod({ ...props.period, startDate: e.target.value });
            }}
            className="muiInput"
            type="date"
          />
        </div>
        <div style={{ width: "24%" }} className="labeledInput">
          <label>date de fin</label>
          <input
            value={props.endDate}
            onChange={(e) => {
              props.setPeriod({ ...props.period, endDate: e.target.value });
            }}
            className="muiInput"
            type="date"
          />
        </div>
      </div>
      <div className={styles.tableContainer}>
        {props.loading ? (
          <div className="spinner">
            <CircularProgress />
          </div>
        ) : (
          <div ref={componentRef}>
            <div className="printHeader">
              <img alt="doctolink" src={"./logo.webp"} />
              <h1>
                Rendez-vous{" "}
                {props.startDate === moment().format("yyyy-MM-DD") &&
                props.endDate === moment().format("yyyy-MM-DD")
                  ? "d’aujourd’hui"
                  : `entre ${props.startDate} et ${props.endDate}`}
              </h1>
            </div>
            <div className="printBody">
              <table className="secondaryTable">
                <thead>
                  <tr>
                    <th>date</th>
                    <th>heure</th>
                    <th>patient</th>
                    <th>téléphone</th>
                    <th>type</th>
                    <th>note</th>
                  </tr>
                </thead>
                <tbody>
                  {props.appointments
                    .filter((appointment) =>
                      patient === "TOUS"
                        ? appointment
                        : appointment.patient._id === patient
                    )
                    .filter((appointment) =>
                      doctor === "TOUS"
                        ? appointment
                        : appointment.doctor === doctor
                    )
                    .map((appointment) => {
                      return (
                        <tr key={appointment._id}>
                          <td>
                            {moment(appointment.startDate).format("yyyy-MM-DD")}
                          </td>
                          <td>
                            {moment(appointment.startDate).format("hh:mm")}
                          </td>
                          <td>{appointment.patient.user.name}</td>
                          <td>{appointment.patient.user.phone}</td>
                          <td>
                            <span
                              style={{
                                color: "white",
                                padding: "2px",
                                backgroundColor:
                                  appointment.reservation.type.color,
                              }}
                            >
                              {appointment.reservation.type.name}
                            </span>
                          </td>
                          <td>{appointment.notes}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default RdvTable;
