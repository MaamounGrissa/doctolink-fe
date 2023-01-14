import { Backdrop, CircularProgress, Fade, Modal } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import Layout from "../components/Layout";
import styles from "../../../styles/admin/Config.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import { useSelector } from "react-redux";
import { AppContext } from "../../../utils/AppContext";
import DeleteType from "./components/DeleteType";
import ModifyType from "./components/ModifyType";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link } from "react-router-dom";

function ConfigTypes(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const [action, setAction] = useState("");
  const [type, setType] = useState({});
  const [state, setState] = useState({
    typesLoading: true,
    types: [],
  });

  const { types, loading } = { ...state };

  const { toggleModal, modalOpen } = useContext(AppContext);

  const fetchTypes = async () => {
    const { data } = await axios.post(
      `/type/getbyest/${userInfo.establishment}`
    );
    setState({ ...state, loading: false, types: data });
  };

  useEffect(() => {
    fetchTypes();
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
          <div className={"modal open small"}>
            {action === "MODIFY_TYPE" ? (
              <ModifyType type={type} fetchTypes={fetchTypes} />
            ) : action === "DELETE_TYPE" ? (
              <DeleteType type={type} fetchTypes={fetchTypes} />
            ) : null}
          </div>
        </Fade>
      </Modal>
      <Layout>
        {loading ? (
          <div className="spinner">
            <CircularProgress />
          </div>
        ) : (
          <section className={styles.container}>
            <Link to="/config">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  margin: "-20px 0px 20px 0px",
                  cursor: "pointer",
                  color: "#056ab1",
                  width: "100px",
                }}
              >
                <KeyboardBackspaceIcon />
                &nbsp;
                <p>Précédent</p>
              </div>
            </Link>
            <table>
              <thead>
                <tr>
                  <th>motif de consultation</th>
                  <th>durée</th>
                  <th>disponibilité en ligne</th>
                  <th>actions</th>
                </tr>
              </thead>
              <tbody>
                {types?.map((type) => {
                  return (
                    <tr key={type._id}>
                      <td>
                        <div className="row">
                          <div
                            style={{ backgroundColor: type.color }}
                            className="bubble"
                          />
                          &nbsp; &nbsp;
                          <p>{type.name}</p>
                        </div>
                      </td>
                      <td>{type.duration ? type.duration + " min" : "--"}</td>
                      <td>{type.online === true ? "oui" : "non"}</td>
                      <td>
                        <EditIcon
                          onClick={() => {
                            setType(type);
                            setAction("MODIFY_TYPE");
                            toggleModal();
                          }}
                          style={{ color: "#2DCB06" }}
                          fontSize="medium"
                          className={styles.btn}
                        />
                        &nbsp;
                        <DeleteOutlineIcon
                          onClick={() => {
                            setType(type);
                            setAction("DELETE_TYPE");
                            toggleModal();
                          }}
                          style={{ color: "#CB0664" }}
                          fontSize="medium"
                          className={styles.btn}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}
      </Layout>
    </>
  );
}

export default ConfigTypes;
