import React, { useState, useContext } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";

function DeleteAgenda(props) {
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const deleteAgenda = async () => {
    try {
      const { data } = await axios.delete(`/agenda/remove/${props.agenda._id}`);
      enqueueSnackbar(data.message, { variant: "success" });
      props.fetchAgendas();
      toggleModal();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  return (
    <div>
      <h1>supprimer agenda: {props.agenda.name} ?</h1>
      <div className="row">
        <button
          onClick={() => {
            deleteAgenda();
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

export default DeleteAgenda;
