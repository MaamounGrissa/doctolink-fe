import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import moment from "moment";

function AddCell(props) {
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const [cell, setCell] = useState({
    startDate: "",
    endDate: "",
    type: "",
    color: "",
    Qty: "",
    calendarId: "",
  });

  const addCell = async () => {
    try {
      const { data } = await axios.put(`/reservation/add`, cell);
      enqueueSnackbar(data.message, { variant: "info" });
      props.fetchCalendar();
      toggleModal();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  useEffect(() => {
    if (props)
      setCell({
        ...props.cellInfo,
        type: props.types[0]._id,
        Qty: 1,
        calendarId: props.calendarId,
      });
  }, [props]);

  return (
    <div>
      <h1>ajouter une cellule</h1>
      <div className="row">
        <div className="col50 column">
          <p>
            début:&nbsp;
            {moment(props.cellInfo.startDate).format("yyyy-MM-DD  HH:mm")}
          </p>
          <p>
            fin: &nbsp;&nbsp;&nbsp;&nbsp;
            {moment(props.cellInfo.endDate).format("yyyy-MM-DD  HH:mm")}
          </p>
        </div>
        <div className="col50 column">
          <div
            style={{
              width: "220px",
              display: "flex",
              justifyContent: "space-between",
            }}
            className="row"
          >
            <label>type:</label>&nbsp;&nbsp;
            <select
              onChange={(e) => {
                setCell({
                  ...cell,
                  type: e.target.value,
                });
              }}
              className="dateInput"
              style={{
                width: "100px",
              }}
            >
              {props.types.map((type) => {
                return (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div
            style={{
              width: "220px",
              display: "flex",
              justifyContent: "space-between",
            }}
            className="row"
          >
            <label>quantité:</label>&nbsp;&nbsp;
            <input
              type="number"
              value={cell.Qty}
              onChange={(e) =>
                setCell({ ...cell, Qty: Number(e.target.value) })
              }
              min={1}
              style={{
                width: "100px",
              }}
              className="dateInput"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <button
          onClick={() => {
            addCell();
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

export default AddCell;
