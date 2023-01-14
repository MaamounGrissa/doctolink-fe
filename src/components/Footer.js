import React from "react";
import styles from "../styles/Footer.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link } from "react-router-dom";
import moment from "moment";

function Footer(props) {
  return (
    <div className={styles.container}>
      <img alt="logo" src={"/logo-white.webp"} />
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.colRow}>
            <CallIcon style={{ color: "white" }} />
            &nbsp;
            <p>***********</p>
          </div>
          <div className={styles.colRow}>
            <LocationOnIcon style={{ color: "white" }} />
            &nbsp;
            <p>***********</p>
          </div>
          <p>
            {moment(Date.now()).format("YYYY")} - powered by{" "}
            <a
              style={{ fontWeight: "500" }}
              href="https://creo.tn"
              target={"_blank"}
            >
              creo
            </a>
          </p>
        </div>
        <div className={styles.col}>
          <h1 style={{ borderBottom: "2px solid #06CB90" }}>
            Informations pratiques
          </h1>
          <p>
            Accès pour personnes à mobilité réduite: oui Etage: RDC MAISON
            INDIVIDUELLE
          </p>
        </div>
        <div className={styles.col}>
          <h1>Moyen de transport</h1>
          <p>
            Parking privatif Le cabinet de Kinésithérapie se trouve sur la rue
            Robert Béchade en direction de Ruffec. En raison de la crise
            sanitaire, les toilettes ne sont pas accessibles, merci de prendre
            vos précautions
          </p>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <Link to="/" target={"_blank"}>
          <FacebookIcon style={{ color: "white" }} />
        </Link>
        &nbsp;
        <Link to="/" target={"_blank"}>
          <TwitterIcon style={{ color: "white" }} />
        </Link>
        &nbsp;
        <Link to="/" target={"_blank"}>
          <WhatsAppIcon style={{ color: "white" }} />
        </Link>
      </div>
    </div>
  );
}

export default Footer;
