import React, { useRef, useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";
import estStyles from "../styles/superadmin/Home.module.css";
import Footer from "../components/Footer";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

function Home(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [drop, setDrop] = useState(false);
  const [state, setState] = useState({ loading: false, establishments: [] });
  const { loading, establishments } = { ...state };

  const [formData, setFormData] = useState({
    specialty: "",
    city: "",
  });

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const resultsRef = useRef(null);

  const handleSubmit = async (e) => {
    setState({ ...state, loading: true });
    e.preventDefault();
    handleScroll(resultsRef.current);
    try {
      const { data } = await axios.post("/establishments/search", formData);
      data.length > 0
        ? setState({ ...state, loading: false, establishments: data })
        : setState({ ...state, loading: false, establishments: undefined });
    } catch (error) {
      setState({ ...state, loading: false });
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const handleScroll = (ref) => {
    window.scrollTo({
      top: ref.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
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
            <h1>
              PRENEZ RAPIDEMENT <br /> UN RENDEZ-VOUS AVEC VOTRE MÉDECIN !
            </h1>
            <h2>nous prenons soin de votre santé</h2>
            <div className={styles.row}>
              {userInfo ? (
                <>
                  <Link to="/dashboard">
                    <div className={styles.dropBtn}>dashboard</div>
                  </Link>
                  &nbsp;&nbsp;
                  <div
                    onClick={() => {
                      dispatch({ type: "USER_LOGOUT" });
                    }}
                    className={styles.dropBtn}
                  >
                    logout
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => setDrop(!drop)}
                    className={styles.dropBtn}
                  >
                    inscription
                    <div
                      className={drop ? styles.dropMenu : styles.closedDropMenu}
                    >
                      <Link to="/register?PATIENT">
                        <p>patient</p>
                      </Link>
                      <Link to="/register?DOCTOR">
                        <p>medecin</p>
                      </Link>
                    </div>
                  </div>
                  &nbsp;&nbsp;
                  <Link to="/login">
                    <div className={styles.dropBtn}>se connecter</div>
                  </Link>
                </>
              )}
            </div>
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
      <section id="filter" className={styles.filter}>
        <form onSubmit={handleSubmit}>
          <div className="labeledInput">
            <label>spécialité</label>
            <select
              required
              onChange={(e) => {
                setFormData({ ...formData, specialty: e.target.value });
              }}
              placeholder="spécialité"
              type="text"
              className="dateInput"
            >
              <option disabled selected value="">
                Spécialité
              </option>
              <option value="Acupuncteur">Acupuncteur</option>
              <option value="Addictologue">Addictologue</option>
              <option value="Allergologue">Allergologue</option>
              <option value="Anesthésiste">Anesthésiste</option>
              <option value="Angiologue">Angiologue</option>
              <option value="Aromathérapeute">Aromathérapeute</option>
              <option value="Cabinet dentaire">Cabinet dentaire</option>
              <option value="Cabinet médical">Cabinet médical</option>
              <option value="Cancérologue">Cancérologue</option>
              <option value="Cancérologue médical">Cancérologue médical</option>
              <option value="Cancérologue radiothérapeute">
                Cancérologue radiothérapeute
              </option>
              <option value="Cardiologue">Cardiologue</option>
              <option value="Cardiologue du sport">Cardiologue du sport</option>
              <option value="Cardiologue Rythmologue">
                Cardiologue Rythmologue
              </option>
              <option value="Centre de chirurgie réfractive">
                Centre de chirurgie réfractive
              </option>
              <option value="Centre de médecine préventive">
                Centre de médecine préventive
              </option>
              <option value="Centre de planification et d'éducation familiale">
                Centre de planification et d'éducation familiale
              </option>
              <option value="Centre de santé">Centre de santé</option>
              <option value="Centre Laser">Centre Laser</option>
              <option value="Centre médical et dentaire">
                Centre médical et dentaire
              </option>
              <option value="Chiropracteur">Chiropracteur</option>
              <option value="Chirurgie de l'épaule">
                Chirurgie de l'épaule
              </option>
              <option value="Chirurgien">Chirurgien</option>
              <option value="Chirurgien cancérologue">
                Chirurgien cancérologue
              </option>
              <option value="Chirurgien de l'obésité">
                Chirurgien de l'obésité
              </option>
              <option value="Chirurgien de la hanche, du genou et du pied">
                Chirurgien de la hanche, du genou et du pied
              </option>
              <option value="Chirurgien de la main">
                Chirurgien de la main
              </option>
              <option value="Chirurgien dentiste">Chirurgien dentiste</option>
              <option value="Chirurgien du genou">Chirurgien du genou</option>
              <option value="Chirurgien du genou et de la hanche">
                Chirurgien du genou et de la hanche
              </option>
              <option value="Chirurgien du membre supérieur">
                Chirurgien du membre supérieur
              </option>
              <option value="Chirurgien du pied">Chirurgien du pied</option>
              <option value="Chirurgien du rachis">Chirurgien du rachis</option>
              <option value="Chirurgien esthétique">
                Chirurgien esthétique
              </option>
              <option value="Chirurgien gynécologique et obstétrique">
                Chirurgien gynécologique et obstétrique
              </option>
              <option value="Chirurgien gynécologue">
                Chirurgien gynécologue
              </option>
              <option value="Chirurgien maxillo-facial">
                Chirurgien maxillo-facial
              </option>
              <option value="Chirurgien maxillo-facial et stomatologiste">
                Chirurgien maxillo-facial et stomatologiste
              </option>
              <option value="Chirurgien ophtalmologue">
                Chirurgien ophtalmologue
              </option>
              <option value="Chirurgien oral">Chirurgien oral</option>
              <option value="Chirurgien orthopédiste">
                Chirurgien orthopédiste
              </option>
              <option value="Chirurgien orthopédiste pédiatrique">
                Chirurgien orthopédiste pédiatrique
              </option>
              <option value="Chirurgien pédiatrique">
                Chirurgien pédiatrique
              </option>
              <option value="Chirurgien plasticien">
                Chirurgien plasticien
              </option>
              <option value="Chirurgien plasticien et esthétique">
                Chirurgien plasticien et esthétique
              </option>
              <option value="Chirurgien sénologue">Chirurgien sénologue</option>
              <option value="Chirurgien urologue">Chirurgien urologue</option>
              <option value="Chirurgien vasculaire">
                Chirurgien vasculaire
              </option>
              <option value="Chirurgien viscéral et digestif">
                Chirurgien viscéral et digestif
              </option>
              <option value="Clinique privée">Clinique privée</option>
              <option value="Dentiste pédiatrique">Dentiste pédiatrique</option>
              <option value="Dermatologue">Dermatologue</option>
              <option value="Dermatologue Allergologue">
                Dermatologue Allergologue
              </option>
              <option value="Dermatologue esthétique">
                Dermatologue esthétique
              </option>
              <option value="Dermatologue pédiatrique">
                Dermatologue pédiatrique
              </option>
              <option value="Diabétologue">Diabétologue</option>
              <option value="Diététicien">Diététicien</option>
              <option value="Doppler">Doppler</option>
              <option value="Echographie gynécologique et obstétricale">
                Echographie gynécologique et obstétricale
              </option>
              <option value="Echographie obstétricale">
                Echographie obstétricale
              </option>
              <option value="Echographiste">Echographiste</option>
              <option value="Endocrinologue">Endocrinologue</option>
              <option value="Endocrinologue diabétologue">
                Endocrinologue diabétologue
              </option>
              <option value="Endocrinologue pédiatrique">
                Endocrinologue pédiatrique
              </option>
              <option value="Epilation laser">Epilation laser</option>
              <option value="ESPIC - Etablissement de Santé Privé d'Intérêt Collectif">
                ESPIC - Etablissement de Santé Privé d'Intérêt Collectif
              </option>
              <option value="Etiopathe">Etiopathe</option>
              <option value="Gastro-entérologue et hépatologue">
                Gastro-entérologue et hépatologue
              </option>
              <option value="Gastro-entérologue pédiatre">
                Gastro-entérologue pédiatre
              </option>
              <option value="Gériatre">Gériatre</option>
              <option value="Gynécologue">Gynécologue</option>
              <option value="Gynécologue sexologue">
                Gynécologue sexologue
              </option>
              <option value="Gynécologue-obstétricien">
                Gynécologue-obstétricien
              </option>
              <option value="Hématologue">Hématologue</option>
              <option value="Homéopathe">Homéopathe</option>
              <option value="Hôpital privé">Hôpital privé</option>
              <option value="Hypnopraticien">Hypnopraticien</option>
              <option value="Hypnothérapeute">Hypnothérapeute</option>
              <option value="Infirmier">Infirmier</option>
              <option value="Infirmière coordinatrice">
                Infirmière coordinatrice
              </option>
              <option value="Laser">Laser</option>
              <option value="Masseur-kinésithérapeute">
                Masseur-kinésithérapeute
              </option>
              <option value="Masseur-kinésithérapeute du sport">
                Masseur-kinésithérapeute du sport
              </option>
              <option value="Médecin de la douleur">
                Médecin de la douleur
              </option>
              <option value="Médecin du sport">Médecin du sport</option>
              <option value="Médecin esthétique">Médecin esthétique</option>
              <option value="Médecin généraliste">Médecin généraliste</option>
              <option value="Médecin nutritionniste">
                Médecin nutritionniste
              </option>
              <option value="Médecin ostéopathe">Médecin ostéopathe</option>
              <option value="Médecin physique - Réadaptateur">
                Médecin physique - Réadaptateur
              </option>
              <option value="Médecine anti-âge">Médecine anti-âge</option>
              <option value="Médecine Interne">Médecine Interne</option>
              <option value="Médecine Morphologique et Anti-âge">
                Médecine Morphologique et Anti-âge
              </option>
              <option value="Médecine préventive">Médecine préventive</option>
              <option value="Naturopathe">Naturopathe</option>
              <option value="Néphrologue">Néphrologue</option>
              <option value="Neurochirurgien">Neurochirurgien</option>
              <option value="Neurologue">Neurologue</option>
              <option value="Neuropédiatre">Neuropédiatre</option>
              <option value="Neuropsychiatre">Neuropsychiatre</option>
              <option value="Obstétricien">Obstétricien</option>
              <option value="Oncologie">Oncologie</option>
              <option value="Oncologue">Oncologue</option>
              <option value="Ophtalmologue">Ophtalmologue</option>
              <option value="Ophtalmologue pédiatrique">
                Ophtalmologue pédiatrique
              </option>
              <option value="ORL">ORL</option>
              <option value="ORL - Chirurgien de la face et du cou">
                ORL - Chirurgien de la face et du cou
              </option>
              <option value="ORL et Chirurgien Plastique">
                ORL et Chirurgien Plastique
              </option>
              <option value="ORL pédiatrique">ORL pédiatrique</option>
              <option value="Orthodontiste">Orthodontiste</option>
              <option value="Orthopédiste">Orthopédiste</option>
              <option value="Orthophoniste">Orthophoniste</option>
              <option value="Orthoptiste">Orthoptiste</option>
              <option value="Ostéopathe">Ostéopathe</option>
              <option value="Pathologiste">Pathologiste</option>
              <option value="Pédiatre">Pédiatre</option>
              <option value="Pédicure-podologue">Pédicure-podologue</option>
              <option value="Pédopsychiatre">Pédopsychiatre</option>
              <option value="Phlébologue">Phlébologue</option>
              <option value="Planning familial">Planning familial</option>
              <option value="PMA/AMP - FIV - Fertilité">
                PMA/AMP - FIV - Fertilité
              </option>
              <option value="Pneumo-allergologue">Pneumo-allergologue</option>
              <option value="Pneumo-pédiatre">Pneumo-pédiatre</option>
              <option value="Pneumologue">Pneumologue</option>
              <option value="Podologue du sport">Podologue du sport</option>
              <option value="Posturologue">Posturologue</option>
              <option value="Proctologue">Proctologue</option>
              <option value="Psychanalyste">Psychanalyste</option>
              <option value="Psychiatre">Psychiatre</option>
              <option value="Psychiatre de l'enfant et de l'adolescent">
                Psychiatre de l'enfant et de l'adolescent
              </option>
              <option value="Psychologue">Psychologue</option>
              <option value="Psychologue clinicien">
                Psychologue clinicien
              </option>
              <option value="Psychothérapeute">Psychothérapeute</option>
              <option value="Radiologue">Radiologue</option>
              <option value="Radiothérapeute">Radiothérapeute</option>
              <option value="Rhumatologue">Rhumatologue</option>
              <option value="Rythmologue interventionnel">
                Rythmologue interventionnel
              </option>
              <option value="Sage femme">Sage femme</option>
              <option value="Sénologue">Sénologue</option>
              <option value="Sexologue">Sexologue</option>
              <option value="Sexologue médecin">Sexologue médecin</option>
              <option value="Sophrologue">Sophrologue</option>
              <option value="Stomatologue">Stomatologue</option>
              <option value="Tabacologue">Tabacologue</option>
              <option value="Trouble du sommeil">Trouble du sommeil</option>
              <option value="Urologue">Urologue</option>
            </select>
          </div>
          <div className="labeledInput">
            <label>lieu</label>
            <input
              className="dateInput"
              placeholder="lieu"
              type="text"
              onChange={(e) => {
                setFormData({ ...formData, city: e.target.value });
              }}
            />
          </div>
          <button className={styles.dropBtn}>rechercher</button>
        </form>
        {loading ? (
          <div className="spinner">
            <CircularProgress />
          </div>
        ) : (
          <div ref={resultsRef} className={styles.results}>
            {establishments ? (
              establishments.map((establishment) => {
                return (
                  <Link key={establishment._id} to={`/doctors`}>
                    <div
                      onClick={() => {
                        dispatch({
                          type: "SET_CURRENT_ESTABLISHMENT",
                          payload: establishment,
                        });
                      }}
                      key={establishment._id}
                      className={estStyles.col}
                    >
                      <div className={estStyles.card}>
                        <h1>{establishment.name}</h1>
                        <h2>{establishment.adress}</h2>
                        <p>ville: {establishment.city}</p>
                        <p>code postale: {establishment.postalCode}</p>
                        <p>
                          {establishment.weekend.includes(6) &&
                          establishment.weekend.includes(7)
                            ? "disponible: lundi au vendredi"
                            : establishment.weekend.includes(6)
                            ? "disponible: dimanche au vendredi"
                            : establishment.weekend.includes(7)
                            ? "disponible: lundi au samedi"
                            : "disponible: toute la semaine"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <h1>aucun résultat !</h1>
            )}
          </div>
        )}
      </section>
      <section className={styles.body}>
        <div className={styles.row}>
          <div className={styles.titleRow}>
            <h1>à propos de nous</h1>
            <img alt="med" src={"/icons/med.webp"} />
          </div>
          <p>
            Le cabinet de Kinésithérapie, SELARL PHIMABCD - Philippe HOLLNER se
            situe à Chef Boutonne, (commune dynamique des Deux - Sèvres) à une
            heure de La Rochelle et 45 min de Niort et Poitiers dans un cadre
            neuf et agréable, doté d 'une infrastructure et matériels
            performants et récents. Je consulte sur le plan orthopédique,
            neurologique et respiratoire.
          </p>
        </div>
        <div className={styles.row}>
          <h2>formation</h2>
          <p>
            Ecole "Physiotherapie Schule Ortenau" (Bade Würtemberg) : cursus
            complet en thérapie manuelle et Bobath (en 2008) Kinésio Taping
            (Expert) - Drainage Lymphatique manuel - Massage de bien-être
          </p>
        </div>
        <div className={styles.row}>
          <h2>Expériences professionnelles depuis 2009 :</h2>
          <p>
            Exercice en milieu carcéral - Exercice en milieu hospitalier
            (service oncologie et soins palliatifs) - Exercice en résidence
            autonomie et EHPAD.
          </p>
          <p>
            Il est impératif de présenter sa carte vitale et la prescription
            médicale lors du premier rendez vous au cabinet. Le patient doit
            être en possession de sa carte vitale et d'un moyen de paiement à
            chaque rendez - vous.
          </p>
        </div>
        <div className={styles.row}>
          <div className={styles.titleRow}>
            <h1>nos valeurs</h1>
            <img alt="diamond" src={"/icons/diamond.webp"} />
          </div>
          <p style={{ textAlign: "center" }}>
            est une plateforme novatrice qui vous permet de trouver rapidement
            un médecin le plus proche de vous et de fixer un rendez-vous en
            ligne gratuitement.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Home;
