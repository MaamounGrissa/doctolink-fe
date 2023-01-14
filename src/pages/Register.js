import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Register.module.css";
import Layout from "../components/Layout";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import { AppContext } from "../utils/AppContext";

function Register(props) {
  const [form, setForm] = useState("PATIENT");
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { search } = useLocation();

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    adress: "",
    postalCode: "",
    specialty: "",
    demandObject: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const { password, confirmPassword, role } = { ...formData };

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (role === "PATIENT") {
      if (password !== confirmPassword)
        return (
          enqueueSnackbar("passwords doesn't match !", {
            variant: "error",
          }),
          setLoading(false)
        );

      try {
        const { data } = await axios.post("/register", formData);
        enqueueSnackbar(data.message, { variant: "success" });
        dispatch({ type: "USER_LOGIN", payload: data.userInfo });
        setLoading(false);
      } catch (error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
        setLoading(false);
      }
    } else {
      try {
        const { data } = await axios.post("/register", formData);
        enqueueSnackbar(data.message, { variant: "success" });
        document.getElementById("doctorForm").reset();
        setTerms(!terms);
        setLoading(false);
      } catch (error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    search.slice(1) === "PATIENT" ? (
      <>{(setForm("PATIENT"), setFormData({ ...formData, role: "PATIENT" }))}</>
    ) : (
      <>{(setForm("DOCTOR"), setFormData({ ...formData, role: "DOCTOR" }))}</>
    );
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.col}>
          <img
            alt="register"
            src={form === "DOCTOR" ? "/register.webp" : "/register2.webp"}
          />
        </div>
        <div className={styles.col}>
          {form === "PATIENT" ? (
            <form id="patientForm" onSubmit={submitHandler}>
              <h1>
                Êtes-vous un médecin ?{" "}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData({ ...formData, role: "DOCTOR" });
                    setForm("DOCTOR");
                    setTerms(false);
                  }}
                  className="defaultBtn"
                >
                  créer votre compte
                </button>
              </h1>
              <br />
              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <div className="labeledInput">
                    <label>nom</label>
                    <input
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value });
                      }}
                      required
                      type="text"
                      placeholder="nom *"
                      className="defaultInput"
                    />
                  </div>
                  <div className="labeledInput">
                    <label>téléphone</label>
                    <input
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                      }}
                      required
                      type="number"
                      placeholder="téléphone *"
                      className="defaultInput"
                    />
                  </div>
                  <div className="labeledInput">
                    <label>mot de passe</label>
                    <input
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                      }}
                      required
                      type="password"
                      placeholder="mot de passe *"
                      className="defaultInput"
                    />
                  </div>
                </div>
                <div className={styles.formCol}>
                  <div className="labeledInput">
                    <label>prénom</label>
                    <input
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value });
                      }}
                      required
                      type="text"
                      placeholder="prénom *"
                      className="defaultInput"
                    />
                  </div>
                  <div className="labeledInput">
                    <label>email</label>
                    <input
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                      }}
                      required
                      type="email"
                      placeholder="adresse mail *"
                      className="defaultInput"
                    />
                  </div>
                  <div className="labeledInput">
                    <label>confirmer mot de passe</label>
                    <input
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        });
                      }}
                      required
                      type="password"
                      placeholder="confirmer le mot de passe *"
                      className="defaultInput"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.checkRow}>
                <input
                  onChange={() => {
                    setTerms(!terms);
                  }}
                  className={styles.checkBox}
                  type="checkbox"
                  checked={terms}
                />
                <label>
                  J'accepte les CGU ainsi que la politique de confidentialité du
                  site
                </label>
              </div>
              <div className={styles.checkRow}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <button
                    type="submit"
                    form="patientForm"
                    className={terms ? "defaultBtn" : "disabledBtn"}
                  >
                    inscription
                  </button>
                )}
              </div>
            </form>
          ) : (
            <form id="doctorForm" onSubmit={submitHandler}>
              <h1>
                Êtes-vous un patient ?{" "}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData({ ...formData, role: "PATIENT" });
                    setForm("PATIENT");
                    setTerms(false);
                  }}
                  className="defaultBtn"
                >
                  créer votre compte
                </button>
              </h1>
              <br />
              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <div className="labeledInput">
                    <label>nom</label>
                    <input
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          firstName: e.target.value,
                        });
                      }}
                      required
                      type="text"
                      placeholder="nom *"
                      className="defaultInput"
                    />
                  </div>
                  <div className="labeledInput">
                    <label>adresse de cabinet</label>
                    <input
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          adress: e.target.value,
                        });
                      }}
                      required
                      type="text"
                      placeholder="adresse cabinet *"
                      className="defaultInput"
                    />
                  </div>
                  <div className="labeledInput">
                    <label>téléphone</label>
                    <input
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        });
                      }}
                      required
                      type="number"
                      placeholder="téléphone *"
                      className="defaultInput"
                    />
                  </div>
                  <div className="labeledInput">
                    <label>spécialité</label>
                    <input
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          specialty: e.target.value,
                        });
                      }}
                      required
                      type="text"
                      placeholder="spécialité *"
                      className="defaultInput"
                    />
                  </div>
                </div>
                <div className={styles.formCol}>
                  <div className="labeledInput">
                    <label>prénom</label>
                    <input
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          lastName: e.target.value,
                        });
                      }}
                      required
                      type="text"
                      placeholder="prénom *"
                      className="defaultInput"
                    />
                  </div>
                  <div className="labeledInput">
                    <label>code postal de cabinet</label>
                    <input
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          postalCode: e.target.value,
                        });
                      }}
                      required
                      type="text"
                      placeholder="code postal cabinet *"
                      className="defaultInput"
                    />
                  </div>
                  <div className="labeledInput">
                    <label>email</label>
                    <input
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        });
                      }}
                      required
                      type="email"
                      placeholder="adresse mail *"
                      className="defaultInput"
                    />
                  </div>
                  <div className="labeledInput">
                    <label>objet de votre demande</label>
                    <input
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          demandObject: e.target.value,
                        });
                      }}
                      required
                      type="text"
                      placeholder="objet de votre demande *"
                      className="defaultInput"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.checkRow}>
                <input
                  onChange={() => {
                    setTerms(!terms);
                  }}
                  className={styles.checkBox}
                  type="checkbox"
                  checked={terms}
                />
                <label>
                  J'accepte les CGU ainsi que la politique de confidentialité du
                  site
                </label>
              </div>
              <div className={styles.checkRow}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <button
                    type="submit"
                    className={terms ? "defaultBtn" : "disabledBtn"}
                  >
                    inscription
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Register;
