import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { ColorPicker } from "material-ui-color";
import { useSelector } from "react-redux";

function ModifyAgenda(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    establishment: "",
    color: "",
    online: true,
    duration: 0,
  });
  const { _id, name, color, duration, online } = { ...formData };

  const modifyType = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/type/modify", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      document.getElementById("form").reset();
      props.fetchTypes();
      toggleModal();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  useEffect(() => {
    setFormData({
      ...props.type,
    });
  }, [props]);

  return (
    <>
      <h1>modifier le type: {props.type.name}</h1>
      <form style={{ marginTop: "50px" }} id="form" onSubmit={modifyType}>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <div className="col60">
            <div className="row">
              <label>type de consultation: </label>
              <input
                required
                style={{ width: "800px" }}
                className="transparentInput"
                type="text"
                placeholder="type"
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
                value={name}
              />
            </div>
            <div className="row">
              <label>durée: </label>
              <input
                required
                className="transparentInput"
                type="number"
                placeholder="durée"
                onChange={(e) => {
                  setFormData({ ...formData, duration: e.target.value });
                }}
                value={duration}
              />
              <label style={{ marginLeft: "-60px" }}>min </label>
            </div>
            <div className="row">
              <label>disponibilité en ligne: </label>
              <select
                required
                style={{ cursor: "pointer" }}
                className="transparentInput"
                type="text"
                placeholder="nom"
                onChange={(e) => {
                  setFormData({ ...formData, online: e.target.value });
                }}
                value={online}
              >
                <option value={true}>Oui</option>
                <option value={false}>Non</option>
              </select>
            </div>
          </div>
          <div className="col40">
            <div className="row">
              <label>couleur: </label>
              <ColorPicker
                value={color}
                onChange={(e) => {
                  setFormData({ ...formData, color: "#" + e.hex });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <button type="submit" className="defaultBtn">
            enregister
          </button>
          &nbsp;
          <button
            type="button"
            onClick={() => {
              toggleModal();
            }}
            className="cancelBtn"
          >
            annuler
          </button>
        </div>
      </form>
    </>
  );
}

export default ModifyAgenda;
