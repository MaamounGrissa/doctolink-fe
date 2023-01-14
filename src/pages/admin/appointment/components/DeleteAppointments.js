import React, { useContext, useState } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useSelector } from "react-redux";

function DeleteAppointments(props) {
  const { toggleModal } = useContext(AppContext);
  const { userInfo } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [motif, setMotif] = useState("");

  const cancelAppointments = async () => {
    try {
      const { data } = await axios.put(`/appointment/cancel`, {
        appointments: props.appointments,
        createdBy: userInfo.id,
        establishment: userInfo.establishment,
        motif: motif,
      });
      props.fetchAppointments();
      props.setSelected([]);
      enqueueSnackbar(data.message, { variant: "success" });
      toggleModal();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  return (
    <div>
      <h1>annuler {props.appointments.length} rendez-vous ?</h1>
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
      <div className="row">
        <button
          onClick={() => {
            cancelAppointments();
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

export default DeleteAppointments;
