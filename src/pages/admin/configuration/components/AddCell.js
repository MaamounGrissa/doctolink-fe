import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";

function AddCell(props) {
  const [cell, setCell] = useState({});
  const [state, setState] = useState({
    typesLoading: true,
    types: [],
  });
  const { typesLoading, types } = { ...state };

  const fetchTypes = async () => {
    const { data } = await axios.post(`/type/getbyagenda/${props.agenda?._id}`);
    setState({ ...state, typesLoading: false, types: data });
  };

  useEffect(() => {
    if (props.agenda) fetchTypes();
  }, [props]);

  useEffect(() => {
    setCell({
      ...props.cellInfo,
      type: types[0]?._id,
      Qty: 1,
    });
  }, [types]);

  return (
    <div>
      <h1>configurer la cellule</h1>
      {typesLoading ? (
        <div className="spinner">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div
            style={{
              flexDirection: "column",
              margin: "50px 0px",
              alignItems: "flex-start",
            }}
            className="row"
          >
            <label>Type</label>
            <select
              onChange={(e) => {
                setCell({
                  ...props.cellInfo,
                  type: e.target.value,
                  Qty: cell.Qty,
                });
              }}
              style={{ width: "45%" }}
              className="dateInput"
            >
              {types.map((type) => {
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
              flexDirection: "column",
              margin: "50px 0px",
              alignItems: "flex-start",
            }}
            className="row"
          >
            <label>Quantitée</label>
            <input
              onChange={(e) => {
                setCell({ ...cell, Qty: e.target.value });
              }}
              value={cell.Qty}
              min={1}
              max={10}
              type="number"
              style={{ width: "45%" }}
              className="dateInput"
            />
          </div>
        </>
      )}
      <div className="row">
        <button
          onClick={() => {
            props.addCell(cell);
          }}
          className="defaultBtn"
        >
          confirmer
        </button>
        &nbsp;
        <button
          onClick={() => {
            props.setAction("");
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
