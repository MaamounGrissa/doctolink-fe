import React, { cloneElement, useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import moment from "moment";
import {
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  Tooltip,
} from "@mui/material";
import { useSelector } from "react-redux";
import AddAppointment from "../../agenda/components/AddAppointment";
import EventBusy from "@mui/icons-material/EventBusy";
import CancelDemand from "./CancelDemand";

function ApproveAppointment(props) {
  const { toggleModal } = useContext(AppContext);
  const { currentDoctor, userInfo } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [cell, setCell] = useState({});
  const [action, setAction] = useState("");
  const [patients, setPatients] = useState("");
  const [calendar, setCalendar] = useState({});
  const [loading, setLoading] = useState(true);

  const deleteDemand = async () => {
    if (props)
      await axios.delete(`/demand/cancel/${props.appointment.reservation._id}`);
  };

  const getFreeSpots = async () => {
    try {
      const { data } = await axios.post(
        `/calendar/getfreebydoctor/${currentDoctor._id}`,
        {
          startDate: moment(props.appointment.reservation.startDate).format(
            "yyyy-MM-DDThh:mm"
          ),
          endDate: moment(props.appointment.reservation.endDate).format(
            "yyyy-MM-DDThh:mm"
          ),
        }
      );
      setCalendar(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const fetchPatients = async () => {
    try {
      const { data } = await axios.get(
        `/patient/get/${userInfo.establishment}`
      );
      setPatients(data);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  useEffect(() => {
    setLoading(true);
    if (props) {
      getFreeSpots();
      fetchPatients();
    }
  }, []);

  return (
    <>
      <Modal
        open={action !== ""}
        onClose={() => setAction("")}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={action !== ""}>
          <div
            style={{ overflowY: "scroll" }}
            className={
              action !== ""
                ? action === "ADD_APPOINTMENT"
                  ? "modal big open"
                  : "modal small open"
                : "modal "
            }
          >
            {action === "ADD_APPOINTMENT" ? (
              <AddAppointment
                setAction={setAction}
                userInfo={userInfo}
                calendar={calendar}
                cell={cell}
                fetchDemands={props.fetchDemands}
                currentDoctor={currentDoctor}
                patients={patients}
                patient={props.appointment.patient}
                deleteDemand={deleteDemand}
              />
            ) : action === "CANCEL_DEMAND" ? (
              <CancelDemand
                setAction={setAction}
                userInfo={userInfo}
                calendar={calendar}
                cell={cell}
                fetchDemands={props.fetchDemands}
                currentDoctor={currentDoctor}
                patients={patients}
                patient={props.appointment.patient}
                deleteDemand={deleteDemand}
              />
            ) : null}
          </div>
        </Fade>
      </Modal>
      <div className="row column">
        <h1>
          approver cette demande de type:{" "}
          {props.appointment.reservation.type.name} ?
        </h1>
        <div className="row">
          <div className="col50 column">
            <div style={{ marginTop: "-10px" }} className="row">
              <h2>patient : </h2>&nbsp;&nbsp;
              <p style={{ fontSize: "13px" }}>
                {props.appointment.patient.user.name}
              </p>
            </div>
            <div style={{ marginTop: "-10px" }} className="row">
              <h2>date : </h2>&nbsp;&nbsp;
              <p style={{ fontSize: "13px" }}>
                le{" "}
                {moment(props.appointment.reservation.startDate).format(
                  "yyyy-MM-DD"
                )}{" "}
                - de{" "}
                {moment(props.appointment.reservation.startDate).format(
                  "hh:mm"
                )}{" "}
                à{" "}
                {moment(props.appointment.reservation.endDate).format("hh:mm")}
              </p>
            </div>
            {props.appointment.motif ? (
              <div style={{ marginTop: "-10px" }} className="row">
                <h2>motif : </h2>&nbsp;&nbsp;
                <p style={{ fontSize: "13px" }}>{props.appointment.motif}</p>
              </div>
            ) : null}
          </div>
          <div style={{ alignItems: "center" }} className="col50 column">
            <Tooltip title="annuler la demande">
              <EventBusy
                onClick={() => {
                  setAction("CANCEL_DEMAND");
                }}
                style={{ cursor: "pointer" }}
                fontSize="large"
                color="fourth"
              />
            </Tooltip>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="spinner">
          <CircularProgress />
        </div>
      ) : (
        <>
          {calendar?.spots?.length > 0 ? (
            <fieldset style={{ border: "1px solid #ccc" }}>
              <legend>
                <h2>&nbsp; rendez-vous disponible &nbsp;</h2>
              </legend>
              <div className="row">
                <div className="cellContainer">
                  {calendar.spots.map((spot) => {
                    return (
                      <div
                        onClick={() => {
                          setCell(spot);
                          setAction("ADD_APPOINTMENT");
                        }}
                        style={{
                          color: "white",
                          backgroundColor: spot.type.color,
                        }}
                        key={spot._id}
                        className="cell"
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          {spot.type.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </fieldset>
          ) : (
            <div
              style={{
                width: "100%",
                height: "30%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="row"
            >
              <h2>il n'y a aucun rendez-vous disponible !</h2>
            </div>
          )}
        </>
      )}
      <div className="row">
        <button
          style={{ marginLeft: "2px" }}
          onClick={() => toggleModal()}
          className="cancelBtn"
        >
          annuler
        </button>
      </div>
    </>
  );
}

export default ApproveAppointment;
