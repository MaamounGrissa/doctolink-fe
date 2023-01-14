import { Backdrop, CircularProgress, Fade, Modal } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import Layout from "../components/Layout";
import styles from "../../../styles/admin/Config.module.css";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ModifyMember from "./components/ModifyMember";
import AddIcon from "@mui/icons-material/Add";
import { AppContext } from "../../../utils/AppContext";
import AddAgenda from "./components/AddAgenda";
import ModifyAgenda from "./components/ModifyAgenda";
import TuneIcon from "@mui/icons-material/Tune";
import ActivateAgenda from "./components/ActivateAgenda";
import BlockAgenda from "./components/BlockAgenda";
import DeleteAgenda from "./components/DeleteAgenda";
import ConfigAgenda from "./components/ConfigAgenda";

function ConfigHome(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(
    localStorage.getItem("selectedOption")
      ? JSON.parse(localStorage.getItem("selectedOption"))
      : "DOCTORS"
  );
  const [doctorsState, setDoctorsState] = useState({
    doctorsLoading: true,
    doctors: [],
  });
  const [agendasState, setAgendasState] = useState({
    agendasLoading: true,
    agendas: [],
  });
  const { doctorsLoading, doctors } = { ...doctorsState };
  const { agendasLoading, agendas } = { ...agendasState };

  const { toggleModal, modalOpen } = useContext(AppContext);

  const [doctor, setDoctor] = useState({});
  const [agenda, setAgenda] = useState({});
  const [action, setAction] = useState("");

  const fetchDoctors = async () => {
    const { data } = await axios.post(
      `/establishments/getbyest/${userInfo?.establishment}`
    );
    setDoctorsState({ ...doctorsState, doctors: data, doctorsLoading: false });
  };

  const fetchAgendas = async () => {
    const { data } = await axios.post(
      `/agenda/getbyest/${userInfo?.establishment}`
    );
    setAgendasState({ ...agendasState, agendas: data, agendasLoading: false });
  };

  useEffect(() => {
    fetchDoctors();
    fetchAgendas();
  }, []);

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={toggleModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          {action === "MODIFY_DOCTOR" ? (
            <div className={"modal open small"}>
              <ModifyMember member={doctor} fetchMembers={fetchDoctors} />
            </div>
          ) : action === "ADD_AGENDA" ? (
            <div className={"modal open small"}>
              <AddAgenda fetchAgendas={fetchAgendas} />
            </div>
          ) : action === "MODIFY_AGENDA" ? (
            <div className={"modal open small"}>
              <ModifyAgenda agenda={agenda} fetchAgendas={fetchAgendas} />
            </div>
          ) : action === "BLOCK_AGENDA" ? (
            <div className={"modal open small"}>
              <BlockAgenda agenda={agenda} fetchAgendas={fetchAgendas} />
            </div>
          ) : action === "ACTIVATE_AGENDA" ? (
            <div className={"modal open small"}>
              <ActivateAgenda agenda={agenda} fetchAgendas={fetchAgendas} />
            </div>
          ) : action === "DELETE_AGENDA" ? (
            <div className={"modal open small"}>
              <DeleteAgenda agenda={agenda} fetchAgendas={fetchAgendas} />
            </div>
          ) : action === "CONFIG_AGENDA" ? (
            <div className={"modal open big"}>
              <ConfigAgenda
                modalOpen={modalOpen}
                setAction={setAction}
                action={action}
                agenda={agenda}
                fetchAgendas={fetchAgendas}
              />
            </div>
          ) : null}
        </Fade>
      </Modal>
      <Layout>
        <section className={styles.container}>
          <div className={styles.btnRow}>
            <div className={styles.col}>
              <button
                onClick={() => {
                  localStorage.setItem(
                    "selectedOption",
                    JSON.stringify("DOCTORS")
                  );
                  setSelected("DOCTORS");
                }}
                className={
                  selected === "DOCTORS" ? "activeBtn" : "secondaryBtn"
                }
              >
                médecins
              </button>
              &nbsp; &nbsp;
              <button
                onClick={() => {
                  localStorage.setItem(
                    "selectedOption",
                    JSON.stringify("AGENDAS")
                  );
                  setSelected("AGENDAS");
                }}
                className={
                  selected === "AGENDAS" ? "activeBtn" : "secondaryBtn"
                }
              >
                agendas
              </button>
            </div>
            <div className={styles.col}>
              {selected === "AGENDAS" ? (
                <AddIcon
                  onClick={() => {
                    toggleModal();
                    setAction("ADD_AGENDA");
                  }}
                  style={{ cursor: "pointer" }}
                  fontSize="medium"
                  color="primary"
                />
              ) : null}
            </div>
          </div>
          <br />
          {selected === "DOCTORS" ? (
            doctorsLoading ? (
              <div className="spinner">
                <CircularProgress />
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>nom et prénom</th>
                    <th>téléphone</th>
                    <th>e-mail</th>
                    <th>spécialité</th>
                    <th>actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => {
                    return (
                      <tr key={doctor._id}>
                        <td>{doctor.user.name}</td>
                        <td>{doctor.user.phone}</td>
                        <td>{doctor.user.email}</td>
                        <td>{doctor.specialty}</td>
                        <td>
                          <EditIcon
                            onClick={() => {
                              setDoctor(doctor);
                              setAction("MODIFY_DOCTOR");
                              toggleModal();
                            }}
                            style={{ cursor: "pointer", color: "#2DCB06" }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          ) : agendasLoading ? (
            <div className="spinner">
              <CircularProgress />
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>nom</th>
                  <th>
                    <div className={styles.tableRow}>
                      <Link to="/config/types">
                        <SettingsIcon style={{ marginBottom: "-5px" }} />
                      </Link>
                      &nbsp;
                      <p>type de consultation</p>
                    </div>
                  </th>
                  <th>actions</th>
                </tr>
              </thead>
              <tbody>
                {agendas.map((agenda) => {
                  return (
                    <tr key={agenda._id}>
                      <td>{agenda.name}</td>
                      <td>
                        {agenda.types.map((type) => {
                          return (
                            <div
                              style={{ backgroundColor: type.color }}
                              key={type._id}
                              className={styles.type}
                            >
                              {type.name}
                            </div>
                          );
                        })}
                      </td>
                      <td>
                        <TuneIcon
                          onClick={() => {
                            setAgenda(agenda);
                            setAction("CONFIG_AGENDA");
                            toggleModal();
                          }}
                          style={{ color: "#056AB1" }}
                          fontSize="medium"
                          className={styles.btn}
                        />
                        {agenda.isActive ? (
                          <BlockIcon
                            onClick={() => {
                              setAgenda(agenda);
                              setAction("BLOCK_AGENDA");
                              toggleModal();
                            }}
                            style={{ color: "#CB0664" }}
                            fontSize="medium"
                            className={styles.btn}
                          />
                        ) : (
                          <CheckIcon
                            onClick={() => {
                              setAgenda(agenda);
                              setAction("ACTIVATE_AGENDA");
                              toggleModal();
                            }}
                            style={{ color: "#2DCB06" }}
                            fontSize="medium"
                            className={styles.btn}
                          />
                        )}
                        &nbsp;
                        <EditIcon
                          onClick={() => {
                            setAgenda(agenda);
                            setAction("MODIFY_AGENDA");
                            toggleModal();
                          }}
                          style={{ color: "#2DCB06" }}
                          fontSize="medium"
                          className={styles.btn}
                        />
                        &nbsp;
                        <DeleteOutlineIcon
                          onClick={() => {
                            setAgenda(agenda);
                            setAction("DELETE_AGENDA");
                            toggleModal();
                          }}
                          style={{ color: "#056AB1" }}
                          fontSize="medium"
                          className={styles.btn}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </Layout>
    </>
  );
}

export default ConfigHome;
