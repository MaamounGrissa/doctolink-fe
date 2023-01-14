import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

function RemoveCell(props) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTypes = async () => {
    const { data } = await axios.post(`/type/getbyagenda/${props.agenda._id}`);
    setTypes(data);
    setLoading(false);
  };

  useEffect(() => {
    if (props.agenda) fetchTypes();
  }, [props]);

  return (
    <div>
      {loading ? (
        <div className="spinner">
          <CircularProgress />
        </div>
      ) : (
        <>
          <h1>
            supprimer cette cellule de type{" "}
            {types.find((type) => type._id === props.cellInfo.type).name} ?
          </h1>
          <div className="row">
            <button
              onClick={() => {
                props.removeCell(
                  props.cellInfo.row,
                  props.cellInfo.type,
                  props.cellInfo.cellIndex
                );
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
        </>
      )}
    </div>
  );
}

export default RemoveCell;
