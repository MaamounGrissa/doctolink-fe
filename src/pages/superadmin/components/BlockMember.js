import React, { useContext } from "react";
import { AppContext } from "../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";

function BlockMember(props) {
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const blockMember = async () => {
    try {
      if (props.member.user.role === "DOCTOR") {
        const { data } = await axios.put(`/doctor/block/${props.member._id}`);
        enqueueSnackbar(data.message, { variant: "success" });
        props.fetchMembers();
        toggleModal();
      } else {
        const { data } = await axios.put(`/admin/block/${props.member._id}`);
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
      <h1>bloquer membre: {props.member.user.name} ?</h1>
      <div className="row">
        <button
          onClick={() => {
            blockMember();
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

export default BlockMember;
