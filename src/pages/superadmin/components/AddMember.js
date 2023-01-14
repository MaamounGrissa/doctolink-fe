import React, { useState, useContext } from "react";
import { AppContext } from "../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";

function AddMember(props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "",
    password: "",
    phone: "",
    role: "",
    establishment: props.establishment,
  });
  const { role } = { ...formData };
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const addMember = async (e) => {
    e.preventDefault();

    if (role === "DOCTOR") {
      try {
        const { data } = await axios.post("/doctor/add", formData);
        enqueueSnackbar(data.message, { variant: "success" });
        document.getElementById("form").reset();
        props.fetchMembers();
        toggleModal();
      } catch (error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    } else {
      try {
        const { data } = await axios.post("/admin/add", formData);
        enqueueSnackbar(data.message, { variant: "success" });
        document.getElementById("form").reset();
        props.fetchMembers();
        toggleModal();
      } catch (error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    }
  };

  return (
    <>
      <h1>ajouter un membre</h1>
      <form id="form" onSubmit={addMember}>
        <div className="row">
          <div className="col50">
            <div className="labeledInput">
              <label>nom</label>
              <input
                autoComplete="new-password"
                required
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
                placeholder="Nom"
                className="defaultInput"
                type="text"
              />
            </div>
          </div>
          <div className="col50">
            <div className="labeledInput">
              <label>téléphone</label>
              <input
                autoComplete="new-password"
                required
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                }}
                placeholder="tél"
                className="defaultInput"
                type="number"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col50">
            <div className="labeledInput">
              <label>email</label>
              <input
                autoComplete="new-password"
                required
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                }}
                placeholder="email"
                className="defaultInput"
                type="text"
              />
            </div>
          </div>
          <div className="col50">
            <div className="labeledInput">
              <label>mot de passe</label>
              <input
                autoComplete="new-password"
                required
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                }}
                placeholder="mot de passe"
                className="defaultInput"
                type="password"
              />
            </div>
          </div>
        </div>
        <div style={{ padding: "5px" }} className="row">
          {formData.role === "DOCTOR" ? (
            <input
              autoComplete="new-password"
              required
              onChange={(e) => {
                setFormData({ ...formData, specialty: e.target.value });
              }}
              placeholder="spécialité"
              className="defaultInput"
              type="text"
            />
          ) : null}
        </div>
        <div className="row">
          <div className="inputRow">
            <label>Role: </label> &nbsp; &nbsp; &nbsp;
            <div>
              <input
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value });
                }}
                type="radio"
                id="admin"
                name="RADIO"
                value="ADMIN"
                required
              />
              <label htmlFor="admin">Admin</label>
            </div>
            &nbsp; &nbsp; &nbsp;
            <div>
              <input
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value });
                }}
                type="radio"
                id="doctor"
                name="RADIO"
                value="DOCTOR"
                required
              />
              <label htmlFor="doctor">Doctor</label>
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

export default AddMember;
