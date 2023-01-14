import React, { useEffect, useState, useContext } from "react";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import { AppContext } from "../../../../utils/AppContext";
import axios from "axios";

function ModifyPatient(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { toggleModal } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    sex: "",
    securityNumber: "",
    paymentCenter: "",
    birthday: "",
    fixNumber: "",
    adress: "",
    information: "",
  });
  const {
    name,
    email,
    phone,
    password,
    sex,
    securityNumber,
    paymentCenter,
    birthday,
    fixNumber,
    adress,
    information,
  } = { ...formData };

  const [loading, setLoading] = useState(false);

  const modifyPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `/patient/modify/${formData.id}`,
        formData
      );
      enqueueSnackbar(data.message, { variant: "success" });
      setFormData({
        establishment: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        sex: "",
        securityNumber: "",
        paymentCenter: "",
        birthday: "",
        fixNumber: "",
        adress: "",
        information: "",
      });
      props.fetchPatients();
      toggleModal();
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props)
      setFormData({ ...{ ...props.patient, user: "" }, ...props.patient.user });
  }, [props]);

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
          <h1>modifier le patient: {props.patient.user.name}</h1>
        </div>
      </div>

      <div className="row">
        <form onSubmit={modifyPatient} style={{ width: "100%" }}>
          <div style={{ padding: "0px 5px" }} className="row">
            <div className="labeledInput">
              <label>genre</label>
              <select
                value={sex}
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
                value={birthday}
                onChange={(e) => {
                  setFormData({ ...formData, birthday: e.target.value });
                }}
                type="date"
                placeholder="date de naissance "
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
                  value={name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                  }}
                  type="text"
                  placeholder="nom "
                  className="defaultInput"
                />
              </div>
              <div className="labeledInput">
                <label>téléphone</label>
                <input
                  value={phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                  }}
                  type="number"
                  placeholder="téléphone "
                  className="defaultInput"
                />
              </div>
              <div className="labeledInput">
                <label>téléphone fixe</label>
                <input
                  value={fixNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, fixNumber: e.target.value });
                  }}
                  type="number"
                  placeholder="téléphone fixe"
                  className="defaultInput"
                />
              </div>
              <div className="labeledInput">
                <label>centre de payement</label>
                <input
                  value={paymentCenter}
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
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  value={email}
                  type="email"
                  placeholder="email"
                  className="defaultInput"
                />
              </div>
              <div className="labeledInput">
                <label>mot de passe</label>
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  value={password}
                  autoComplete="new-password"
                  type="password"
                  placeholder="mot de passe "
                  className="defaultInput"
                />
              </div>
              <div className="labeledInput">
                <label>adresse</label>
                <input
                  value={adress}
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
                  value={securityNumber}
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
              <label>informations et habitudes</label>
              <textarea
                value={information}
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
              <button className="secondBtn">modifier</button>
            )}
            &nbsp;
            <button
              onClick={() => toggleModal()}
              type="button"
              className="cancelBtn"
            >
              annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifyPatient;
