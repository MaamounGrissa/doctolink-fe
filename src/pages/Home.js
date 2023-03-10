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
              PRENEZ RAPIDEMENT <br /> UN RENDEZ-VOUS AVEC VOTRE M??DECIN !
            </h1>
            <h2>nous prenons soin de votre sant??</h2>
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
            <label>sp??cialit??</label>
            <select
              required
              onChange={(e) => {
                setFormData({ ...formData, specialty: e.target.value });
              }}
              placeholder="sp??cialit??"
              type="text"
              className="dateInput"
            >
              <option disabled selected value="">
                Sp??cialit??
              </option>
              <option value="Acupuncteur">Acupuncteur</option>
              <option value="Addictologue">Addictologue</option>
              <option value="Allergologue">Allergologue</option>
              <option value="Anesth??siste">Anesth??siste</option>
              <option value="Angiologue">Angiologue</option>
              <option value="Aromath??rapeute">Aromath??rapeute</option>
              <option value="Cabinet dentaire">Cabinet dentaire</option>
              <option value="Cabinet m??dical">Cabinet m??dical</option>
              <option value="Canc??rologue">Canc??rologue</option>
              <option value="Canc??rologue m??dical">Canc??rologue m??dical</option>
              <option value="Canc??rologue radioth??rapeute">
                Canc??rologue radioth??rapeute
              </option>
              <option value="Cardiologue">Cardiologue</option>
              <option value="Cardiologue du sport">Cardiologue du sport</option>
              <option value="Cardiologue Rythmologue">
                Cardiologue Rythmologue
              </option>
              <option value="Centre de chirurgie r??fractive">
                Centre de chirurgie r??fractive
              </option>
              <option value="Centre de m??decine pr??ventive">
                Centre de m??decine pr??ventive
              </option>
              <option value="Centre de planification et d'??ducation familiale">
                Centre de planification et d'??ducation familiale
              </option>
              <option value="Centre de sant??">Centre de sant??</option>
              <option value="Centre Laser">Centre Laser</option>
              <option value="Centre m??dical et dentaire">
                Centre m??dical et dentaire
              </option>
              <option value="Chiropracteur">Chiropracteur</option>
              <option value="Chirurgie de l'??paule">
                Chirurgie de l'??paule
              </option>
              <option value="Chirurgien">Chirurgien</option>
              <option value="Chirurgien canc??rologue">
                Chirurgien canc??rologue
              </option>
              <option value="Chirurgien de l'ob??sit??">
                Chirurgien de l'ob??sit??
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
              <option value="Chirurgien du membre sup??rieur">
                Chirurgien du membre sup??rieur
              </option>
              <option value="Chirurgien du pied">Chirurgien du pied</option>
              <option value="Chirurgien du rachis">Chirurgien du rachis</option>
              <option value="Chirurgien esth??tique">
                Chirurgien esth??tique
              </option>
              <option value="Chirurgien gyn??cologique et obst??trique">
                Chirurgien gyn??cologique et obst??trique
              </option>
              <option value="Chirurgien gyn??cologue">
                Chirurgien gyn??cologue
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
              <option value="Chirurgien orthop??diste">
                Chirurgien orthop??diste
              </option>
              <option value="Chirurgien orthop??diste p??diatrique">
                Chirurgien orthop??diste p??diatrique
              </option>
              <option value="Chirurgien p??diatrique">
                Chirurgien p??diatrique
              </option>
              <option value="Chirurgien plasticien">
                Chirurgien plasticien
              </option>
              <option value="Chirurgien plasticien et esth??tique">
                Chirurgien plasticien et esth??tique
              </option>
              <option value="Chirurgien s??nologue">Chirurgien s??nologue</option>
              <option value="Chirurgien urologue">Chirurgien urologue</option>
              <option value="Chirurgien vasculaire">
                Chirurgien vasculaire
              </option>
              <option value="Chirurgien visc??ral et digestif">
                Chirurgien visc??ral et digestif
              </option>
              <option value="Clinique priv??e">Clinique priv??e</option>
              <option value="Dentiste p??diatrique">Dentiste p??diatrique</option>
              <option value="Dermatologue">Dermatologue</option>
              <option value="Dermatologue Allergologue">
                Dermatologue Allergologue
              </option>
              <option value="Dermatologue esth??tique">
                Dermatologue esth??tique
              </option>
              <option value="Dermatologue p??diatrique">
                Dermatologue p??diatrique
              </option>
              <option value="Diab??tologue">Diab??tologue</option>
              <option value="Di??t??ticien">Di??t??ticien</option>
              <option value="Doppler">Doppler</option>
              <option value="Echographie gyn??cologique et obst??tricale">
                Echographie gyn??cologique et obst??tricale
              </option>
              <option value="Echographie obst??tricale">
                Echographie obst??tricale
              </option>
              <option value="Echographiste">Echographiste</option>
              <option value="Endocrinologue">Endocrinologue</option>
              <option value="Endocrinologue diab??tologue">
                Endocrinologue diab??tologue
              </option>
              <option value="Endocrinologue p??diatrique">
                Endocrinologue p??diatrique
              </option>
              <option value="Epilation laser">Epilation laser</option>
              <option value="ESPIC - Etablissement de Sant?? Priv?? d'Int??r??t Collectif">
                ESPIC - Etablissement de Sant?? Priv?? d'Int??r??t Collectif
              </option>
              <option value="Etiopathe">Etiopathe</option>
              <option value="Gastro-ent??rologue et h??patologue">
                Gastro-ent??rologue et h??patologue
              </option>
              <option value="Gastro-ent??rologue p??diatre">
                Gastro-ent??rologue p??diatre
              </option>
              <option value="G??riatre">G??riatre</option>
              <option value="Gyn??cologue">Gyn??cologue</option>
              <option value="Gyn??cologue sexologue">
                Gyn??cologue sexologue
              </option>
              <option value="Gyn??cologue-obst??tricien">
                Gyn??cologue-obst??tricien
              </option>
              <option value="H??matologue">H??matologue</option>
              <option value="Hom??opathe">Hom??opathe</option>
              <option value="H??pital priv??">H??pital priv??</option>
              <option value="Hypnopraticien">Hypnopraticien</option>
              <option value="Hypnoth??rapeute">Hypnoth??rapeute</option>
              <option value="Infirmier">Infirmier</option>
              <option value="Infirmi??re coordinatrice">
                Infirmi??re coordinatrice
              </option>
              <option value="Laser">Laser</option>
              <option value="Masseur-kin??sith??rapeute">
                Masseur-kin??sith??rapeute
              </option>
              <option value="Masseur-kin??sith??rapeute du sport">
                Masseur-kin??sith??rapeute du sport
              </option>
              <option value="M??decin de la douleur">
                M??decin de la douleur
              </option>
              <option value="M??decin du sport">M??decin du sport</option>
              <option value="M??decin esth??tique">M??decin esth??tique</option>
              <option value="M??decin g??n??raliste">M??decin g??n??raliste</option>
              <option value="M??decin nutritionniste">
                M??decin nutritionniste
              </option>
              <option value="M??decin ost??opathe">M??decin ost??opathe</option>
              <option value="M??decin physique - R??adaptateur">
                M??decin physique - R??adaptateur
              </option>
              <option value="M??decine anti-??ge">M??decine anti-??ge</option>
              <option value="M??decine Interne">M??decine Interne</option>
              <option value="M??decine Morphologique et Anti-??ge">
                M??decine Morphologique et Anti-??ge
              </option>
              <option value="M??decine pr??ventive">M??decine pr??ventive</option>
              <option value="Naturopathe">Naturopathe</option>
              <option value="N??phrologue">N??phrologue</option>
              <option value="Neurochirurgien">Neurochirurgien</option>
              <option value="Neurologue">Neurologue</option>
              <option value="Neurop??diatre">Neurop??diatre</option>
              <option value="Neuropsychiatre">Neuropsychiatre</option>
              <option value="Obst??tricien">Obst??tricien</option>
              <option value="Oncologie">Oncologie</option>
              <option value="Oncologue">Oncologue</option>
              <option value="Ophtalmologue">Ophtalmologue</option>
              <option value="Ophtalmologue p??diatrique">
                Ophtalmologue p??diatrique
              </option>
              <option value="ORL">ORL</option>
              <option value="ORL - Chirurgien de la face et du cou">
                ORL - Chirurgien de la face et du cou
              </option>
              <option value="ORL et Chirurgien Plastique">
                ORL et Chirurgien Plastique
              </option>
              <option value="ORL p??diatrique">ORL p??diatrique</option>
              <option value="Orthodontiste">Orthodontiste</option>
              <option value="Orthop??diste">Orthop??diste</option>
              <option value="Orthophoniste">Orthophoniste</option>
              <option value="Orthoptiste">Orthoptiste</option>
              <option value="Ost??opathe">Ost??opathe</option>
              <option value="Pathologiste">Pathologiste</option>
              <option value="P??diatre">P??diatre</option>
              <option value="P??dicure-podologue">P??dicure-podologue</option>
              <option value="P??dopsychiatre">P??dopsychiatre</option>
              <option value="Phl??bologue">Phl??bologue</option>
              <option value="Planning familial">Planning familial</option>
              <option value="PMA/AMP - FIV - Fertilit??">
                PMA/AMP - FIV - Fertilit??
              </option>
              <option value="Pneumo-allergologue">Pneumo-allergologue</option>
              <option value="Pneumo-p??diatre">Pneumo-p??diatre</option>
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
              <option value="Psychoth??rapeute">Psychoth??rapeute</option>
              <option value="Radiologue">Radiologue</option>
              <option value="Radioth??rapeute">Radioth??rapeute</option>
              <option value="Rhumatologue">Rhumatologue</option>
              <option value="Rythmologue interventionnel">
                Rythmologue interventionnel
              </option>
              <option value="Sage femme">Sage femme</option>
              <option value="S??nologue">S??nologue</option>
              <option value="Sexologue">Sexologue</option>
              <option value="Sexologue m??decin">Sexologue m??decin</option>
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
              <h1>aucun r??sultat !</h1>
            )}
          </div>
        )}
      </section>
      <section className={styles.body}>
        <div className={styles.row}>
          <div className={styles.titleRow}>
            <h1>?? propos de nous</h1>
            <img alt="med" src={"/icons/med.webp"} />
          </div>
          <p>
            Le cabinet de Kin??sith??rapie, SELARL PHIMABCD - Philippe HOLLNER se
            situe ?? Chef Boutonne, (commune dynamique des Deux - S??vres) ?? une
            heure de La Rochelle et 45 min de Niort et Poitiers dans un cadre
            neuf et agr??able, dot?? d 'une infrastructure et mat??riels
            performants et r??cents. Je consulte sur le plan orthop??dique,
            neurologique et respiratoire.
          </p>
        </div>
        <div className={styles.row}>
          <h2>formation</h2>
          <p>
            Ecole "Physiotherapie Schule Ortenau" (Bade W??rtemberg) : cursus
            complet en th??rapie manuelle et Bobath (en 2008) Kin??sio Taping
            (Expert) - Drainage Lymphatique manuel - Massage de bien-??tre
          </p>
        </div>
        <div className={styles.row}>
          <h2>Exp??riences professionnelles depuis 2009 :</h2>
          <p>
            Exercice en milieu carc??ral - Exercice en milieu hospitalier
            (service oncologie et soins palliatifs) - Exercice en r??sidence
            autonomie et EHPAD.
          </p>
          <p>
            Il est imp??ratif de pr??senter sa carte vitale et la prescription
            m??dicale lors du premier rendez vous au cabinet. Le patient doit
            ??tre en possession de sa carte vitale et d'un moyen de paiement ??
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
            un m??decin le plus proche de vous et de fixer un rendez-vous en
            ligne gratuitement.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Home;
