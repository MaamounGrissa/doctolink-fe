import React, { useState, useContext, useEffect } from "react";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { useSnackbar } from "notistack";
import axios from "axios";
import { AppContext } from "../../../utils/AppContext";

function ModifyEstablishment(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { toggleModal } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    phone: 0,
    adress: "",
    city: "",
    specialty: "",
    postalCode: "",
    startHour: 0,
    endHour: 0,
    weekend: [],
  });
  const {
    name,
    phone,
    adress,
    city,
    specialty,
    postalCode,
    startHour,
    endHour,
    weekend,
  } = { ...formData };

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  const modifyEstablishment = async (e) => {
    e.preventDefault();
    if (startHour < 8 || startHour > 23 || endHour > 23 || endHour < 8)
      return enqueueSnackbar("working hours must be between 8 and 23 !", {
        variant: "error",
      });
    try {
      const { data } = await axios.put("/establishment/modify", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      toggleModal();
      document.getElementById("form").reset();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
    props.fetchEst();
  };

  useEffect(() => {
    setFormData({ ...props.establishment });
  }, [props.establishment]);

  return (
    <>
      <h1>modifier l’établissement</h1>
      <form id="form" onSubmit={modifyEstablishment}>
        <div className="row">
          <div className="col50">
            <div className="labeledInput">
              <label>nom d&apos;établissement</label>
              <input
                required
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
                placeholder="Nom etablissement"
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
                required
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                }}
                placeholder="tél etablissement"
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
              <label>adresse</label>
              <input
                required
                onChange={(e) => {
                  setFormData({ ...formData, adress: e.target.value });
                }}
                placeholder="adresse"
                className="defaultInput"
                type="text"
                value={adress}
              />
            </div>
          </div>
          <div className="col50">
            <div className="labeledInput">
              <label>spécialité</label>
              <select
                required
                onChange={(e) => {
                  setFormData({ ...formData, specialty: e.target.value });
                }}
                placeholder="spécialité"
                className="defaultInput"
                type="text"
                value={specialty}
              >
                <option value="Acupuncteur">Acupuncteur</option>
                <option value="Addictologue">Addictologue</option>
                <option value="Allergologue">Allergologue</option>
                <option value="Anesthésiste">Anesthésiste</option>
                <option value="Angiologue">Angiologue</option>
                <option value="Aromathérapeute">Aromathérapeute</option>
                <option value="Cabinet dentaire">Cabinet dentaire</option>
                <option value="Cabinet médical">Cabinet médical</option>
                <option value="Cancérologue">Cancérologue</option>
                <option value="Cancérologue médical">
                  Cancérologue médical
                </option>
                <option value="Cancérologue radiothérapeute">
                  Cancérologue radiothérapeute
                </option>
                <option value="Cardiologue">Cardiologue</option>
                <option value="Cardiologue du sport">
                  Cardiologue du sport
                </option>
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
                <option value="Chirurgien du rachis">
                  Chirurgien du rachis
                </option>
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
                <option value="Chirurgien sénologue">
                  Chirurgien sénologue
                </option>
                <option value="Chirurgien urologue">Chirurgien urologue</option>
                <option value="Chirurgien vasculaire">
                  Chirurgien vasculaire
                </option>
                <option value="Chirurgien viscéral et digestif">
                  Chirurgien viscéral et digestif
                </option>
                <option value="Clinique privée">Clinique privée</option>
                <option value="Dentiste pédiatrique">
                  Dentiste pédiatrique
                </option>
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
          </div>
        </div>
        <div className="row">
          <div className="col50">
            <div className="labeledInput">
              <label>ville</label>
              <input
                required
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                }}
                placeholder="ville"
                className="defaultInput"
                type="text"
                value={city}
              />
            </div>
          </div>
          <div className="col50">
            <div className="labeledInput">
              <label>code postal</label>
              <input
                required
                onChange={(e) => {
                  setFormData({ ...formData, postalCode: e.target.value });
                }}
                placeholder="code postal"
                className="defaultInput"
                type="text"
                value={postalCode}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col50">
            <div className="labeledInput">
              <label>heure de début</label>
              <input
                required
                onChange={(e) => {
                  setFormData({ ...formData, startHour: e.target.value });
                }}
                placeholder="heure début"
                className="numberInput"
                type="number"
                value={startHour}
              />
            </div>
            <div className="icon">
              <QueryBuilderIcon fontSize="large" color="secondary" />
            </div>
          </div>
          <div className="col50">
            <div className="labeledInput">
              <label>heure de fin</label>
              <input
                required
                onChange={(e) => {
                  setFormData({ ...formData, endHour: e.target.value });
                }}
                placeholder="heure fin"
                className="numberInput"
                type="number"
                value={endHour}
              />
            </div>

            <div className="icon">
              <QueryBuilderIcon fontSize="large" color="secondary" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="inputRow">
            <p>weekend: </p>
            <input
              onChange={(e) => {
                if (e.target.checked === true) {
                  setFormData({
                    ...formData,
                    weekend: [...weekend, 6],
                  });
                } else {
                  setFormData({
                    ...formData,
                    weekend: removeItemOnce(weekend, 6),
                  });
                }
              }}
              className="checkbox"
              type="checkBox"
              checked={weekend.includes(6)}
            />
            <label>samedi</label>
            <input
              onChange={(e) => {
                if (e.target.checked === true) {
                  setFormData({
                    ...formData,
                    weekend: [...weekend, 0],
                  });
                } else {
                  setFormData({
                    ...formData,
                    weekend: removeItemOnce(weekend, 0),
                  });
                }
              }}
              className="checkbox"
              type="checkBox"
              checked={weekend.includes(0)}
            />
            <label>dimanche</label>
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

export default ModifyEstablishment;
