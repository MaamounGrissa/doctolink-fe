import React, { useContext } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";

function DeleteCell(props) {
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const deleteCell = async () => {
    try {
      const { data } = await axios.delete(
        `/reservation/remove/${props.cell._id}`
      );
      enqueueSnackbar(data.message, { variant: "info" });
      props.fetchCalendar();
      toggleModal();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  return (
    <div>
      <h1>supprimer cette cellule de type: {props.cell.type.name} ?</h1>
      <div className="row">
        <button
          onClick={() => {
            deleteCell();
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

export default DeleteCell;
