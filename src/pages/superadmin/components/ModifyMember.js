import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";

function ModifyMember(props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const { name, email, phone, role } = { ...formData };
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const modifyMember = async (e) => {
    e.preventDefault();

    if (role === "DOCTOR") {
      try {
        const { data } = await axios.put("/doctor", formData);
        enqueueSnackbar(data.message, { variant: "success" });
        document.getElementById("form").reset();
        props.fetchMembers();
        toggleModal();
      } catch (error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    } else {
      try {
        const { data } = await axios.put("/admin", formData);
        enqueueSnackbar(data.message, { variant: "success" });
        document.getElementById("form").reset();
        props.fetchMembers();
        toggleModal();
      } catch (error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    }
  };

  useEffect(() => {
    setFormData({ ...props.member.user });
  }, [props]);

  return (
    <>
      <h1>modifier le membre: {props.member.user.name}</h1>
      <form id="form" onSubmit={modifyMember}>
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
                value={name}
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
                value={phone}
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
                type="email"
                value={email}
              />
            </div>
          </div>
          <div className="col50">
            <div className="labeledInput">
              <label>mot de passe</label>
              <input
                autoComplete="new-password"
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

export default ModifyMember;
