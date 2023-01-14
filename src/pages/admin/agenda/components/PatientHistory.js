import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import moment from "moment";

function AddPatient(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({ loading: true, appointments: [] });
  const { loading, appointments } = { ...state };

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(
        `/appointment/getbypatientandcalendar/${props.calendarId}/${props.patient._id}`
      );
      setState({ loading: false, appointments: data });
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setState({ loading: false });
    }
  };

  useEffect(() => {
    setState({ ...state, loading: true });
    if (props) {
      fetchAppointments();
    }
  }, [props]);

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div className="row">
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>historique de: {props.patient?.user?.name}</h1>
          <CloseIcon
            onClick={() => {
              props.setAction("");
            }}
            color="primary"
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      {loading ? (
        <div className="row">
          <div className="spinner">
            <CircularProgress />
          </div>
        </div>
      ) : (
        <div className="row">
          {appointments?.length > 0 ? (
            <table className="defaultTable">
              <thead>
                <tr>
                  <th>date</th>
                  <th>heure</th>
                  <th>docteur</th>
                  <th>type</th>
                  <th>créateur</th>
                  <th>status</th>
                </tr>
              </thead>
              <tbody>
                {appointments?.map((appointment) => {
                  return (
                    <tr>
                      <td>
                        {moment(appointment.startDate).format("yyyy-MM-DD")}
                      </td>
                      <td>{moment(appointment.startDate).format("hh:mm")}</td>
                      <td>{appointment.doctor.user.name}</td>
                      <td>
                        <span
                          style={{
                            backgroundColor: appointment.reservation.type.color,
                            color: "white",
                            padding: "2px",
                          }}
                        >
                          {appointment.reservation.type.name}
                        </span>
                      </td>
                      <td>{appointment.createdBy.name}</td>
                      <td
                        style={{
                          color:
                            appointment.status === "CONFIRMED"
                              ? "#6bee00"
                              : appointment.status === "WAITING"
                              ? "#EE6400"
                              : appointment.status === "CANCELED"
                              ? "#ee3000"
                              : appointment.status === "MISSED"
                              ? "rgb(240,0,240)"
                              : null,
                        }}
                      >
                        {appointment.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>Aucun rendez-vous pour le moment.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AddPatient;
