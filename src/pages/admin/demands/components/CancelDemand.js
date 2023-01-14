import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { sendMessage } from "../../../../utils/Messenger";
import { useSelector } from "react-redux";

function CancelDemand(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const { toggleModal } = useContext(AppContext);
  const [message, setMessage] = useState(
    "votre demande n’a pas été acceptée parce que le calendrier est complet pendant cette période!"
  );
  console.log(userInfo);
  const handleSubmit = async () => {
    try {
      props.deleteDemand();
      sendMessage(
        userInfo.id,
        props.patient.user._id,
        message,
        userInfo.establishment,
        props.patient.user._id
      );
      props.fetchDemands();
      props.setAction("");
      toggleModal();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="row">
        <h1>supprimer la demande et contacter {props.patient.user.name}</h1>
      </div>
      <br />
      <div className="row">
        <div style={{ width: "80%" }} className="labeledInput">
          <label>message</label>
          <textarea
            onChange={(e) => {
              if (e.target.value === "") {
                setMessage(
                  "votre demande n’a pas été acceptée parce que le calendrier est complet pendant cette période!"
                );
              } else {
                setMessage(e.target.value);
              }
            }}
            style={{ height: "200px" }}
            className="defaultInput"
            placeholder="par défaut: votre demande n’a pas été acceptée parce que le calendrier est complet pendant cette période!"
          />
        </div>
      </div>
      <div className="row">
        <button
          onClick={() => {
            handleSubmit();
          }}
          className="defaultBtn"
        >
          envoyer
        </button>
        &nbsp;
        <button
          onClick={() => {
            props.setAction("");
          }}
          className="cancelBtn"
        >
          annuler
        </button>
      </div>
    </>
  );
}

export default CancelDemand;
