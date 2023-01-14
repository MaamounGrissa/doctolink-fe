import React, { useState, useContext } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";

function ActivateAgenda(props) {
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const activateAgenda = async () => {
    try {
      const { data } = await axios.put(`/agenda/block/${props.agenda._id}`);
      enqueueSnackbar(data.message, { variant: "success" });
      props.fetchAgendas();
      toggleModal();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  return (
    <div>
      <h1>bloquer agenda: {props.agenda.name} ?</h1>
      <div className="row">
        <button
          onClick={() => {
            activateAgenda();
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

export default ActivateAgenda;
