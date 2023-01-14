import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../styles/superadmin/Home.module.css";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AddIcon from "@mui/icons-material/Add";
import { Backdrop, CircularProgress, Fade, Modal } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import AddEstablishment from "./components/AddEstablishment";
import { AppContext } from "../../utils/AppContext";

function Home() {
  const [state, setState] = useState({
    loading: true,
    establishments: [],
  });
  const { loading, establishments } = { ...state };

  const { toggleModal, modalOpen } = useContext(AppContext);

  const fetchData = async () => {
    const { data } = await axios.get("/establishment/get");
    setState({ ...state, establishments: data, loading: false });
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <div className={modalOpen ? "modal open" : "modal"}>
            <AddEstablishment fetchData={fetchData} />
          </div>
        </Fade>
      </Modal>
      <section className={styles.container}>
        {loading ? (
          <div className="spinner">
            <CircularProgress />
          </div>
        ) : (
          <>
            {establishments.map((establishment) => {
              return (
                <Link
                  key={establishment._id}
                  to={`/establishment/${establishment._id}`}
                >
                  <div className={styles.col}>
                    <div className={styles.card}>
                      <div className={styles.row}>
                        <MeetingRoomIcon
                          style={{ color: "rgba(0, 0, 0, 0.47)" }}
                        />
                      </div>
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
            })}
            <div className={styles.col}>
              <div className={styles.add}>
                <div
                  onClick={() => {
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
      </section>
    </>
  );
}

export default Home;
