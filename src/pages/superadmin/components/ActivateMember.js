import React, { useContext } from "react";
import { AppContext } from "../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";

function ActivateMember(props) {
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const activateMember = async () => {
    try {
      if (props.member.user.role === "DOCTOR") {
        const { data } = await axios.put(
          `/doctor/activate/${props.member._id}`
        );
        enqueueSnackbar(data.message, { variant: "success" });
        props.fetchMembers();
        toggleModal();
      } else {
        const { data } = await axios.put(`/admin/activate/${props.member._id}`);
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
      <h1>activate member: {props.member.user.name} ?</h1>
      <div className="row">
        <button
          onClick={() => {
            activateMember();
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

export default ActivateMember;
