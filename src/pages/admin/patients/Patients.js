import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import styles from "../../../styles/admin/Patients.module.css";
import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { AppContext } from "../../../utils/AppContext";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import ModifyPatient from "./components/ModifyPatient";
import AddPatient from "./components/AddPatient";
import BlockPatient from "./components/BlockPatient";
import ActivatePatient from "./components/ActivatePatient";

function Patients(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo, currentEstablishment } = useSelector((state) => state.auth);
  const { toggleModal, modalOpen } = useContext(AppContext);

  const [state, setState] = useState({ patients: [], loading: true });
  const { patients, loading } = { ...state };

  const [patient, setPatient] = useState("TOUS");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [phone, setPhone] = useState("");
  const [action, setAction] = useState("");

  const fetchPatients = async () => {
    setState({ ...state, loading: false });
    try {
      const { data } = await axios.get(
        `/patient/getall/${userInfo.establishment}`
      );
      setState({
        loading: false,
        patients: data.map((patient) => {
          return { ...patient, id: patient._id, label: patient.user.name };
        }),
      });
    } catch (error) {
      setState({ loading: false });
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };
  useEffect(() => {
    fetchPatients();
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
          <div
            className={
              modalOpen
                ? action === "ADD_PATIENT" || action === "MODIFY_PATIENT"
                  ? "modal big open"
                  : "modal small open"
                : "modal small"
            }
          >
            {action === "MODIFY_PATIENT" ? (
              <ModifyPatient
                fetchPatients={fetchPatients}
                patient={selectedPatient}
              />
            ) : action === "ADD_PATIENT" ? (
              <AddPatient fetchPatients={fetchPatients} />
            ) : // : action === "DELETE_PATIENT" ? (
            //   <AddPatient />
            // )
            action === "BLOCK_PATIENT" ? (
              <BlockPatient
                establishment={userInfo.establishment}
                fetchPatients={fetchPatients}
                patient={selectedPatient}
              />
            ) : action === "ACTIVATE_PATIENT" ? (
              <ActivatePatient
                establishment={userInfo.establishment}
                fetchPatients={fetchPatients}
                patient={selectedPatient}
              />
            ) : null}
          </div>
        </Fade>
      </Modal>
      <Layout>
        <div style={{ marginTop: "-120px" }} className={styles.container}>
          <div className={styles.row}>
            <h1>patients de cabinet: {currentEstablishment?.name}</h1>
            <div className={styles.controls}>
              <div style={{ height: "50px" }}>
                <Tooltip title="nouveau patient">
                  <AddIcon
                    onClick={() => {
                      setSelectedPatient(patient);
                      setAction("ADD_PATIENT");
                      toggleModal();
                    }}
                    style={{ cursor: "pointer", marginRight: "-100px" }}
                    fontSize="large"
                    color="secondary"
                  />
                </Tooltip>
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <div style={{ width: "22%" }} className="labeledInput">
                <label>patient</label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={patients}
                  value={
                    patient === "TOUS"
                      ? ""
                      : patients.find((p) => p._id === patient)
                  }
                  sx={{ width: "200px", height: "71px" }}
                  onChange={(e, val) => {
                    setPatient(val === "" || val === null ? "TOUS" : val._id);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tous les patients"
                      variant="standard"
                    />
                  )}
                />
              </div>
              <div style={{ width: "22%" }} className="labeledInput">
                <label>téléphone</label>
                <input
                  type="number"
                  className="muiInput"
                  placeholder="téléphone"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>
            </div>
            {patient !== "TOUS" ? (
              <Tooltip title="réinitialiser">
                <RotateLeftIcon
                  onClick={() => {
                    setPatient("TOUS");
                  }}
                  style={{ cursor: "pointer", margin: "10px" }}
                  color="secondary"
                />
              </Tooltip>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.row}>
            <div className={styles.tableContainer}>
              {loading ? (
                <div className="spinner">
                  <CircularProgress />
                </div>
              ) : (
                <table className="thirdTable">
                  <thead>
                    <tr>
                      <th>sex</th>
                      <th>nom</th>
                      <th>email</th>
                      <th>age</th>
                      <th>téléphone</th>
                      <th>rdv.int</th>
                      <th>action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients
                      .filter((p) =>
                        patient !== "TOUS" ? p._id === patient : p
                      )
                      .filter((p) =>
                        phone !== "" ? p.user.phone.match(phone) : p
                      )
                      .map((patient) => {
                        return (
                          <tr>
                            <td>{patient.sex}</td>
                            <td>{patient.user.name}</td>
                            <td>{patient.user.email}</td>
                            <td>
                              {Math.trunc(
                                Math.abs(
                                  moment(patient.birthday).diff(moment()) /
                                    31556952000
                                )
                              )}
                            </td>
                            <td>{patient.user.phone}</td>
                            <td>
                              {patient.blacklisted.includes(
                                userInfo.establishment
                              ) ? (
                                <div
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: "rgb(230,6,50)",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: "rgb(6,230,144)",
                                  }}
                                />
                              )}
                            </td>
                            <td>
                              {patient.blacklisted.includes(
                                userInfo.establishment
                              ) ? (
                                <CheckIcon
                                  onClick={() => {
                                    setSelectedPatient(patient);
                                    setAction("ACTIVATE_PATIENT");
                                    toggleModal();
                                  }}
                                  style={{
                                    color: "#2DCB06",
                                    cursor: "pointer",
                                  }}
                                  fontSize="medium"
                                />
                              ) : (
                                <BlockIcon
                                  onClick={() => {
                                    setSelectedPatient(patient);
                                    setAction("BLOCK_PATIENT");
                                    toggleModal();
                                  }}
                                  style={{
                                    color: "#CB0664",
                                    cursor: "pointer",
                                  }}
                                  fontSize="medium"
                                />
                              )}
                              &nbsp;
                              <EditIcon
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setAction("MODIFY_PATIENT");
                                  toggleModal();
                                }}
                                style={{ color: "#2DCB06", cursor: "pointer" }}
                                fontSize="medium"
                              />
                              {/* &nbsp;
                              <DeleteOutlineIcon
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setAction("DELETE_PATIENT");
                                  toggleModal();
                                }}
                                style={{ color: "#056AB1", cursor: "pointer" }}
                                fontSize="medium"
                              /> */}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Patients;
