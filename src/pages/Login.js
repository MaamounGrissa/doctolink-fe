import React, { useContext, useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import { AppContext } from "../utils/AppContext";

function Home(props) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { socket } = useContext(AppContext);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const { data } = await axios.post("/login", formData);
      if (data.role === "SUPER-ADMIN") {
        dispatch({ type: "USER_LOGIN", payload: data });
      } else if (data.isActive) {
        dispatch({ type: "USER_LOGIN", payload: data });
      } else {
        enqueueSnackbar(
          "votre compte est bloqué, veuillez contacter l'administration !",
          { variant: "warning" }
        );
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.response.data, { variant: "error" });
    }
  };

  return (
    <>
      <Layout>
        <section className={styles.header}>
          <img alt="header" src={"/header.webp"} />
          <div className={styles.overlay}>
            <div className={styles.contact}>
              <a>
                <CallIcon color={"primary"} />
                <p>+216********</p>
              </a>
              <a>
                <LocationOnIcon color={"primary"} />
                <p>***********</p>
              </a>
            </div>
            <div className={styles.container}>
              <img alt="logo" src={"/logo.webp"} />
              <br />
              <form onSubmit={handleSubmit}>
                <div className="labeledInput">
                  <label>email</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    type="text"
                    placeholder="identifiant"
                    required
                  />
                </div>
                <div className={styles.passwordRow}>
                  <div className="labeledInput">
                    <label>mot de passe</label>
                    <input
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      type={visible ? "text" : "password"}
                      placeholder="mot de passe"
                      required
                    />
                  </div>
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
                <p>
                  <Link to="/forgot-password">mot de passe oublié ?</Link>
                </p>

                {loading ? (
                  <CircularProgress />
                ) : (
                  <button className={styles.dropBtn}>se connecter</button>
                )}
              </form>
            </div>
            <div className={styles.bottomRow}>
              <Link to="/" target={"_blank"}>
                <FacebookIcon color={"primary"} />
              </Link>
              &nbsp;
              <Link to="/" target={"_blank"}>
                <TwitterIcon color={"primary"} />
              </Link>
              &nbsp;
              <Link to="/" target={"_blank"}>
                <WhatsAppIcon color={"primary"} />
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default Home;
