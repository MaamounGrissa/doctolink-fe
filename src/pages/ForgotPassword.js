import React, { useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/PasswordReset.module.css";
import { useSnackbar } from "notistack";
import axios from "axios";

function ForgotPassword(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/forgotPassword", { email: email });
      enqueueSnackbar(`un lien de récupération a était envoyé à ${email}`, {
        variant: "info",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <img alt="header" src={"/header.webp"} />
        <div className={styles.overlay}>
          <form onSubmit={handleSubmit}>
            <h1>Entrer votre adresse email pour récupérer votre compte</h1>
            <div className="labeledInput">
              <label>email</label>
              <input
                required
                onChange={(e) => setEmail(e.target.value)}
                className="defaultInput"
                type="email"
                placeholder="email"
              />
            </div>
            <button className="secondBtn">récupérer</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default ForgotPassword;
