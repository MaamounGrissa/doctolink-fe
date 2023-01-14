import React, { useContext } from "react";
import { AppContext } from "../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";

function DeleteMmeber(props) {
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const deleteMember = async () => {
    try {
      if (props.member.user.role === "DOCTOR") {
        const { data } = await axios.delete(
          `/doctor/${props.member._id}/${props.member.user._id}`
        );
        enqueueSnackbar(data.message, { variant: "success" });
        props.fetchMembers();
        toggleModal();
      } else {
        const { data } = await axios.delete(
          `/admin/${props.member._id}/${props.member.user._id}`
        );
        enqueueSnackbar(data.message, { variant: "success" });
        props.fetchMembers();
        toggleModal();
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  return (
    <div>
      <h1>supprimer membre: {props.member.user.name} ?</h1>
      <div className="row">
        <button
          onClick={() => {
            deleteMember();
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

export default DeleteMmeber;
