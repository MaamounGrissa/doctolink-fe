import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "../styles/PasswordReset.module.css";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

function ResetPassword(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [state, setSate] = useState({
    userId: "",
    loading: true,
  });
  const { userId, loading } = { ...state };

  const { email, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const checkResetToken = async () => {
    if (email && token) {
      try {
        const { data } = await axios.post("/checkresettoken", {
          email: email,
          token: token,
        });
        setSate({ ...state, userId: data, loading: false });
      } catch (error) {
        window.location.href = "/";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        return enqueueSnackbar("entrez la même mot de passe ! ", {
          variant: "error",
        });
      } else {
        const { data } = await axios.put("/resetpassword", {
          email: email,
          password: password,
        });
        enqueueSnackbar(data.message, { variant: "success" });
        checkResetToken();
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  useEffect(() => {
    checkResetToken();
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        {loading ? (
          <div className="spinner">
            <CircularProgress />
          </div>
        ) : (
          <>
            <img alt="header" src={"/header.webp"} />
            <div className={styles.overlay}>
              <form onSubmit={handleSubmit}>
                <h1>Changer votre mot de passe</h1>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: "80%" }}
                  className="defaultInput"
                  type={visible ? "text" : "password"}
                  placeholder="mot de passe"
                />
                <div style={{ width: "80%" }} className={styles.passwordRow}>
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={visible ? "text" : "password"}
                    required
                    className="defaultInput"
                    placeholder="confirmer mot de passe"
                  />
                  {visible ? (
                    <div
                      onClick={() => setVisible(!visible)}
                      className={styles.icon}
                    >
                      <VisibilityOffIcon />
                    </div>
                  ) : (
                    <div
                      onClick={() => setVisible(!visible)}
                      className={styles.icon}
                    >
                      <VisibilityIcon />
                    </div>
                  )}
                </div>

                <button className="secondBtn">valider</button>
              </form>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default ResetPassword;
