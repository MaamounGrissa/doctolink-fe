import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/superadmin/Establishment.module.css";
import { Backdrop, CircularProgress, Fade, Modal } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AddIcon from "@mui/icons-material/Add";
import AddMember from "./components/AddMember";
import ActivateMember from "./components/ActivateMember";
import { AppContext } from "../../utils/AppContext";
import ModifyEstablishment from "./components/ModifyEstablishment";
import BlockIcon from "@mui/icons-material/Block";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteMember from "./components/DeleteMember";
import ModifyMember from "./components/ModifyMember";
import BlockMember from "./components/BlockMember";
import CheckIcon from "@mui/icons-material/Check";
import LoginIcon from "@mui/icons-material/Login";
import { useDispatch, useSelector } from "react-redux";

function Establishment() {
  const { id } = useParams();
  const { toggleModal, modalOpen } = useContext(AppContext);

  const [estState, setEstState] = useState({
    loadingEst: true,
    establishment: {},
  });
  const { loadingEst, establishment } = { ...estState };

  const [membersState, setMembersState] = useState({
    loadingMembers: true,
    members: [],
  });
  const { loadingMembers, members } = { ...membersState };

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const history = useNavigate();

  const [action, setAction] = useState("");
  const [member, setMember] = useState({});

  const fetchEst = async () => {
    try {
      const { data } = await axios.post(`/establishment/${id}`);
      setEstState({ ...estState, loadingEst: false, establishment: data });
    } catch (error) {
      history("/");
    }
  };

  const fetchMembers = async () => {
    try {
      const { data } = await axios.post(`/establishment/members/${id}`);
      setMembersState({
        ...membersState,
        loadingMembers: false,
        members: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEst();
  }, [id]);

  useEffect(() => {
    if (id) fetchMembers();
  }, [id]);

  return (
    <>
      <Navbar />
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
          <div
            className={
              modalOpen
                ? action === "BLOCK_MEMBER" ||
                  action === "ACTIVATE_MEMBER" ||
                  action === "DELETE_MEMBER"
                  ? "modal open small"
                  : "modal open"
                : "modal small"
            }
          >
            {action === "MODIFY_EST" ? (
              <ModifyEstablishment
                fetchEst={fetchEst}
                establishment={establishment}
              />
            ) : action === "ADD_MEMBER" ? (
              <>
                <AddMember
                  fetchMembers={fetchMembers}
                  toggleModal={toggleModal}
                  establishment={id}
                />
              </>
            ) : action === "MODIFY_MEMBER" ? (
              <>
                <ModifyMember
                  fetchMembers={fetchMembers}
                  member={member}
                  toggleModal={toggleModal}
                />
              </>
            ) : action === "DELETE_MEMBER" ? (
              <>
                <DeleteMember
                  fetchMembers={fetchMembers}
                  member={member}
                  toggleModal={toggleModal}
                />
              </>
            ) : action === "BLOCK_MEMBER" ? (
              <>
                <BlockMember
                  fetchMembers={fetchMembers}
                  member={member}
                  toggleModal={toggleModal}
                />
              </>
            ) : action === "ACTIVATE_MEMBER" ? (
              <>
                <ActivateMember
                  fetchMembers={fetchMembers}
                  member={member}
                  toggleModal={toggleModal}
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </Fade>
      </Modal>
      <div className={styles.container}>
        {loadingEst ? (
          <div className="spinner">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <h1
                onClick={() => {
                  dispatch({
                    type: "SET_CURRENT_DOCTOR",
                    payload: null,
                  });
                  dispatch({
                    type: "SET_CURRENT_ESTABLISHMENT",
                    payload: establishment,
                  });
                  dispatch({
                    type: "USER_LOGIN",
                    payload: { ...userInfo, establishment: id },
                  });
                  history("/admin-space");
                }}
                style={{ cursor: "pointer" }}
              >
                se connecter à {establishment.name}
              </h1>
              &nbsp;&nbsp;
              <LoginIcon sx={{ fontSize: "30px" }} color="secondary" />
            </div>

            <div className={styles.row}>
              <p>Numéro: {establishment.phone}</p>
              <p>Ville: {establishment.city}</p>
              <p>
                Adresse:{" "}
                {establishment.adress + ", " + establishment.postalCode}
              </p>
              <p>
                Infos:{" "}
                {establishment.weekend.includes(6) &&
                establishment.weekend.includes(0)
                  ? "disponible de: lundi au vendredi"
                  : establishment.weekend.includes(6)
                  ? "disponible de: dimanche au vendredi"
                  : establishment.weekend.includes(0)
                  ? "disponible de: lundi au samedi"
                  : "disponible toute la semaine"}
              </p>
              <p
                onClick={() => {
                  setAction("MODIFY_EST");
                  toggleModal();
                }}
              >
                <img alt="setting" src={"/icons/settingIcon.webp"} />
              </p>
            </div>
          </>
        )}
        {loadingMembers ? (
          <div className="spinner">
            <CircularProgress />
          </div>
        ) : (
          <>
            <h2>accés</h2>
            {members.map((member) => {
              return (
                <div key={member._id} className={styles.member}>
                  <div className={styles.card}>
                    <div className={styles.icon}>
                      <PersonOutlineIcon
                        fontSize="large"
                        style={{
                          color: "rgba(128, 128, 128, 0.12)",
                        }}
                      />
                    </div>
                    <h3>{member.user.name}</h3>
                    <p style={{ marginTop: "0px" }}>{member.user.role}</p>
                    <div className={styles.row}>
                      {member.isActive ? (
                        <BlockIcon
                          onClick={() => {
                            setMember(member);
                            setAction("BLOCK_MEMBER");
                            toggleModal();
                          }}
                          style={{ color: "rgba(203, 6, 100, 0.5)" }}
                          fontSize="small"
                          className={styles.btn}
                        />
                      ) : (
                        <CheckIcon
                          onClick={() => {
                            setMember(member);
                            setAction("ACTIVATE_MEMBER");
                            toggleModal();
                          }}
                          color="secondary"
                          fontSize="small"
                          className={styles.btn}
                        />
                      )}
                      <EditIcon
                        onClick={() => {
                          setMember(member);
                          setAction("MODIFY_MEMBER");
                          toggleModal();
                        }}
                        color="secondary"
                        fontSize="small"
                        className={styles.btn}
                      />
                      {/* <DeleteOutlineIcon
                        onClick={() => {
                          setMember(member);
                          setAction("DELETE_MEMBER");
                          toggleModal();
                        }}
                        style={{ color: "rgba(5, 106, 177, 0.5)" }}
                        fontSize="small"
                        className={styles.btn}
                      /> */}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className={styles.member}>
              <div className={styles.add}>
                <div
                  onClick={() => {
                    setAction("ADD_MEMBER");
                    toggleModal();
                  }}
                  className={styles.icon}
                >
                  <AddIcon fontSize="medium" color={"secondary"} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Establishment;
