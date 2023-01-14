import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";
import { Checkbox, CircularProgress } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

function AddPatient(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    establishment: userInfo.establishment,
    name: "",
    email: "",
    phone: "",
    password: "",
    sex: "Homme",
    securityNumber: "",
    paymentCenter: "",
    birthday: "",
    fixNumber: "",
    adress: "",
    information: "",
  });

  const [loading, setLoading] = useState(false);

  const addPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/patient/create", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      setFormData({
        establishment: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        sex: "Homme",
        securityNumber: "",
        paymentCenter: "",
        birthday: "",
        fixNumber: "",
        adress: "",
        information: "",
      });
      if (props.setOption) props.setOption(data.patient);
      if (props.setPatientOption) props.setPatientOption(data.patient);
      props.setAppointment({ ...props.appointment, patient: data.patient.id });
      props.setAction("");
      setLoading(false);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div className="row">
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>nouveau patient</h1>
          <CloseIcon
            onClick={() => {
              props.setAction("");
            }}
            color="primary"
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <div className="row">
        <form onSubmit={addPatient} style={{ width: "100%" }}>
          <div style={{ padding: "0px 5px" }} className="row">
            <div className="labeledInput">
              <label>genre</label>
              <select
                onChange={(e) => {
                  setFormData({ ...formData, sex: e.target.value });
                }}
                type="text"
                placeholder="sexe"
                className="defaultInput"
              >
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
            </div>
          </div>
          <div style={{ padding: "0px 5px" }} className="row">
            <div className="labeledInput">
              <label>date de naissance</label>
              <input
                required
                onChange={(e) => {
                  setFormData({ ...formData, birthday: e.target.value });
                }}
                type="date"
                placeholder="date de naissance*"
                className="defaultInput"
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div
              style={{ justifyContent: "flex-start", flexDirection: "column" }}
              className="col50"
            >
              <div className="labeledInput">
                <label>nom</label>
                <input
                  required
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                  }}
                  type="text"
                  placeholder="nom*"
                  className="defaultInput"
                />
              </div>
              <div className="labeledInput">
                <label>téléphone</label>
                <input
                  required
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                  }}
                  type="number"
                  placeholder="téléphone*"
                  className="defaultInput"
                />
              </div>
              <div className="labeledInput">
                <label>téléphone fixe</label>
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, fixNumber: e.target.value });
                  }}
                  type="number"
                  placeholder="téléphone fixe"
                  className="defaultInput"
                />
              </div>{" "}
              <div className="labeledInput">
                <label>centre de payement</label>
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, paymentCenter: e.target.value });
                  }}
                  type="text"
                  placeholder="Centre de payement"
                  className="defaultInput"
                />
              </div>
            </div>
            <div
              style={{ justifyContent: "flex-start", flexDirection: "column" }}
              className="col50"
            >
              <div className="labeledInput">
                <label>email</label>
                <input
                  required
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  autoComplete="new-password"
                  type="email"
                  placeholder="email*"
                  className="defaultInput"
                />
              </div>
              <div className="labeledInput">
                <label>mot de passe</label>
                <input
                  required
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  autoComplete="new-password"
                  type="password"
                  placeholder="mot de passe*"
                  className="defaultInput"
                />
              </div>
              <div className="labeledInput">
                <label>adresse</label>
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, adress: e.target.value });
                  }}
                  type="text"
                  placeholder="adresse"
                  className="defaultInput"
                />
              </div>
              <div className="labeledInput">
                <label>numéro de sécurité</label>
                <input
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      securityNumber: e.target.value,
                    });
                  }}
                  type="number"
                  placeholder="Numéro de sécurité"
                  className="defaultInput"
                />
              </div>
            </div>
          </div>
          <div style={{ padding: "5px" }} className="row">
            <div className="labeledInput">
              <label>informations, habitudes</label>
              <textarea
                onChange={(e) => {
                  setFormData({ ...formData, information: e.target.value });
                }}
                rows="4"
                style={{ width: "100%" }}
                type="text"
                placeholder="Informations, habitudes ..."
                className="dateInput"
              />
            </div>
          </div>
          <div style={{ padding: "0px 5px" }} className="row">
            {loading ? (
              <CircularProgress color="secondary" />
            ) : (
              <button className="secondBtn">Ajouter</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPatient;
