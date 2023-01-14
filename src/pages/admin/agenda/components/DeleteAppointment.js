import React, { useContext, useState } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useSelector } from "react-redux";

function DeleteAppointment(props) {
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = useSelector((state) => state.auth);
  const [motif, setMotif] = useState("");

  const deleteAppointment = async () => {
    try {
      const { data } = await axios.put(
        `/appointment/remove/${props.appointment._id}`,
        {
          reservation: props.appointment.reservation._id,
          createdBy: userInfo.id,
          establishment: userInfo.establishment,
          motif: motif,
        }
      );
      enqueueSnackbar(data.message, { variant: "info" });
      if (props.fetchCalendar) {
        props.fetchCalendar();
      }
      if (props.fetchAppointments) {
        props.fetchAppointments();
      }
      if (props.fetchCancels) {
        props.fetchCancels();
      }
      toggleModal();
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  return (
    <div>
      <h1>
        annuler ce rendez-vous de type:{" "}
        {props.appointment.reservation.type.name} ?
      </h1>
      <div className="row">
        <div style={{ width: "80%" }} className="labeledInput">
          <label>motif</label>
          <textarea
            onChange={(e) => setMotif(e.target.value)}
            className="defaultInput"
            style={{ height: "150px" }}
          />
        </div>
      </div>
      {props.appointment.motif ? (
        <div className="row column">
          <h2>raison de patient: </h2>
          <p style={{ fontSize: "13px", marginTop: "-5px" }}>
            {props.appointment.motif}
          </p>
        </div>
      ) : null}
      <div className="row">
        <button
          onClick={() => {
            deleteAppointment();
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
      </div>
    </div>
  );
}

export default DeleteAppointment;
