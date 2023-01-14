import React, { useState, useContext } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";

function DeleteType(props) {
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const deleteType = async () => {
    try {
      const { data } = await axios.delete(`/type/remove/${props.type._id}`);
      enqueueSnackbar(data.message, { variant: "success" });
      props.fetchTypes();
      toggleModal();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  return (
    <div>
      <h1>supprimer type: {props.type.name} ?</h1>
      <div className="row">
        <button
          onClick={() => {
            deleteType();
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

export default DeleteType;
