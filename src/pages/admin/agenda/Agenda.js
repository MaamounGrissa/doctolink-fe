import React, { useContext, useEffect, useState } from "react";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  WeekView,
  Scheduler,
  DayView,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import styles from "../../../styles/admin/Calendar.module.css";
import {
  Checkbox,
  CircularProgress,
  ListItemText,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Layout from "../components/Layout";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import DeleteCell from "./components/DeleteCell";
import AddCell from "./components/AddCell";
import AddAppointment from "./components/AddAppointment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { AppContext } from "../../../utils/AppContext";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import DeleteAppointment from "./components/DeleteAppointment";
import ModifyAppointment from "../appointment/components/ModifyAppointment";
import CallMissedIcon from "@mui/icons-material/CallMissed";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";

function Agenda(props) {
  const { currentDoctor, currentEstablishment, userInfo } = useSelector(
    (state) => state.auth
  );
  const [state, setState] = useState({
    calendar: {},
    appointments: [],
    loading: true,
  });
  const { loading, calendar, appointments } = { ...state };
  const [types, setTypes] = useState([]);
  const [checked, setChecked] = useState(["TOUS"]);
  const [patients, setPatients] = useState([]);
  const [cell, setCell] = useState({});
  const [appointment, setAppointment] = useState({});
  const [cellInfo, setCellInfo] = useState({});
  const [action, setAction] = useState("");
  const [patient, setPatient] = useState("TOUS");
  const { enqueueSnackbar } = useSnackbar();
  const { toggleModal, modalOpen } = useContext(AppContext);
  const [currentViewName, setCurrentViewName] = useState("Week");
  const [period, setPeriod] = useState({
    startDate: moment().startOf("week").format("yyyy-MM-DDThh:mm"),
    endDate: moment().endOf("week").format("yyyy-MM-DDThh:mm"),
  });
  const [dayPeriod, setDayPeriod] = useState({
    startDate: moment().format("yyyy-MM-DDThh:mm"),
    endDate: moment().format("yyyy-MM-DDThh:mm"),
  });

  const currentViewChange = () => {
    currentViewName === "Week"
      ? setCurrentViewName("Day")
      : setCurrentViewName("Week");
  };

  const fetchCalendar = async () => {
    try {
      const { data } = await axios.post(
        `/calendar/getbydoctor/${currentDoctor._id}`,
        period
      );
      setState({
        ...state,
        calendar: data.calendar,
        appointments: data.appointments,
        loading: false,
      });
    } catch (error) {
      setState({ ...state, loading: false });
      if (error.response.data.message)
        enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const fetchTypes = async () => {
    try {
      const { data } = await axios.post(
        `/type/getbyest/${userInfo.establishment}`
      );
      setTypes(data);
    } catch (error) {
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
    if (userInfo) {
      fetchTypes();
      fetchPatients();
    }
  }, [userInfo]);

  useEffect(() => {
    if (checked.length < 1) setChecked(["TOUS"]);
  }, [checked]);

  useEffect(() => {
    setState({ ...state, loading: true });
    fetchCalendar();
  }, [period, currentDoctor]);

  const WeekTimeTableCell = ({ ...restProps }) => {
    const startDate = restProps.startDate;
    const cells = calendar.spots
      .filter(
        (spot) =>
          spot.startDate === moment(startDate).format("yyyy-MM-DDTHH:mm")
      )
      .filter((spot) =>
        checked.length === 1 ? spot : checked.includes(spot.type.name)
      )
      .filter((spot) =>
        patient === "TOUS" ? spot : spot.patient === patient._id
      );

    const appointmentsCells = appointments.filter((spot) =>
      patient === "TOUS" ? spot : spot.patient._id === patient._id
    );

    return (
      <WeekView.TimeTableCell className={styles.cell}>
        <div className={styles.spotsContainer}>
          <div className={styles.overlay}>
            <Tooltip title="ajouter une cellule">
              <AddIcon
                onClick={() => {
                  setCellInfo({
                    startDate: moment(startDate).format("yyyy-MM-DDTHH:mm"),
                    endDate: moment(startDate)
                      .add("minutes", 30)
                      .format("yyyy-MM-DDTHH:mm"),
                  });
                  setAction("ADD_CELL");
                  toggleModal();
                }}
                color="secondary"
                className={styles.icon}
              />
            </Tooltip>
          </div>
          {cells.map((cell) => {
            return (
              <div
                key={cell._id}
                className={styles.spot}
                style={{
                  backgroundColor: cell.type.color,
                  opacity: cell.status !== "FREE" ? 0.7 : 0.3,
                }}
              >
                {appointmentsCells.map((appointment) => {
                  if (appointment.reservation?._id === cell._id)
                    return (
                      <>
                        <div
                          style={{
                            backgroundColor: appointment.reservation.color,
                          }}
                          key={appointment.reservation._id}
                          className={styles.appointment}
                        >
                          <div className="row">
                            <div className="row">
                              <p>
                                <AccessTimeIcon fontSize="small" />
                              </p>
                              &nbsp;
                              <p>
                                {moment(appointment.startDate).format("hh:mm")}{" "}
                                - {moment(appointment.endDate).format("hh:mm")}
                              </p>
                            </div>
                            <p>
                              <div className={styles.status}>
                                {appointment.status === "WAITING" ? (
                                  <Tooltip title="en attente">
                                    <HourglassEmptyIcon
                                      fontSize="medium"
                                      style={{
                                        color: "white",
                                        backgroundColor: "transparent",
                                      }}
                                      className={styles.icon}
                                    />
                                  </Tooltip>
                                ) : appointment.status === "CONFIRMED" ? (
                                  <Tooltip title="confirmé">
                                    <DoneIcon
                                      fontSize="medium"
                                      style={{
                                        color: "white",
                                        backgroundColor: "transparent",
                                      }}
                                      className={styles.icon}
                                    />
                                  </Tooltip>
                                ) : appointment.status === "MISSED" ? (
                                  <Tooltip title="confirmé">
                                    <CallMissedIcon
                                      fontSize="medium"
                                      style={{
                                        color: "white",
                                        backgroundColor: "transparent",
                                      }}
                                      className={styles.icon}
                                    />
                                  </Tooltip>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </p>
                          </div>
                          <div className="row">
                            <p>
                              <PersonOutlineIcon fontSize="small" />
                            </p>
                            &nbsp;
                            <p>{appointment.patient?.user.name}</p>
                          </div>

                          <div className={styles.controls}>
                            <Tooltip title="modifier le rendez-vous">
                              <EditIcon
                                onClick={() => {
                                  setAppointment(appointment);
                                  setAction("MODIFY_APPOINTMENT");
                                  toggleModal();
                                }}
                                fontSize="medium"
                                style={{
                                  color: "white",
                                  backgroundColor: "transparent",
                                }}
                                className={styles.icon}
                              />
                            </Tooltip>
                            <Tooltip title="annuler le rendez-vous">
                              <DeleteIcon
                                onClick={() => {
                                  setAppointment(appointment);
                                  setAction("DELETE_APPOINTMENT");
                                  toggleModal();
                                }}
                                fontSize="medium"
                                style={{
                                  color: "white",
                                  backgroundColor: "transparent",
                                }}
                                className={styles.icon}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </>
                    );
                })}
                {cell.status === "FREE" ? (
                  <div key={cell._id + "*"} className={styles.controls}>
                    <div className={styles.add}>
                      <Tooltip title="nouveau rendez-vous">
                        <CalendarMonthIcon
                          onClick={() => {
                            setCell(cell);
                            setAction("ADD_APPOINTMENT");
                            toggleModal();
                          }}
                          color="secondary"
                          className={styles.icon}
                        />
                      </Tooltip>
                    </div>
                    <Tooltip title="supprimer la cellule">
                      <DeleteIcon
                        onClick={() => {
                          setCell(cell);
                          setAction("DELETE_CELL");
                          toggleModal();
                        }}
                        fontSize="medium"
                        style={{
                          color: "white",
                          backgroundColor: "transparent",
                        }}
                        className={styles.icon}
                      />
                    </Tooltip>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </WeekView.TimeTableCell>
    );
  };
  const DayTimeTableCell = ({ ...restProps }) => {
    const startDate = restProps.startDate;
    const cells = calendar.spots
      .filter(
        (spot) =>
          spot.startDate === moment(startDate).format("yyyy-MM-DDTHH:mm")
      )
      .filter((spot) =>
        checked.length === 1 ? spot : checked.includes(spot.type.name)
      )
      .filter((spot) =>
        patient === "TOUS" ? spot : spot.patient === patient._id
      );

    const appointmentsCells = appointments.filter((spot) =>
      patient === "TOUS" ? spot : spot.patient._id === patient._id
    );

    return (
      <DayView.TimeTableCell className={styles.cell}>
        <div className={styles.spotsContainer}>
          <div className={styles.overlay}>
            <Tooltip title="ajouter une cellule">
              <AddIcon
                onClick={() => {
                  setCellInfo({
                    startDate: moment(startDate).format("yyyy-MM-DDTHH:mm"),
                    endDate: moment(startDate)
                      .add("minutes", 30)
                      .format("yyyy-MM-DDTHH:mm"),
                  });
                  setAction("ADD_CELL");
                  toggleModal();
                }}
                color="secondary"
                className={styles.icon}
              />
            </Tooltip>
          </div>
          {cells.map((cell) => {
            return (
              <div
                key={cell._id}
                className={styles.spot}
                style={{
                  backgroundColor: cell.type.color,
                  opacity: cell.status !== "FREE" ? 0.7 : 0.3,
                }}
              >
                {appointmentsCells.map((appointment) => {
                  if (appointment.reservation?._id === cell._id)
                    return (
                      <>
                        <div
                          style={{
                            backgroundColor: appointment.reservation.type.color,
                          }}
                          key={appointment.reservation._id}
                          className={styles.appointment}
                        >
                          <div className="row">
                            <div className="row">
                              <p>
                                <AccessTimeIcon fontSize="small" />
                              </p>
                              &nbsp;
                              <p>
                                {moment(appointment.startDate).format("hh:mm")}{" "}
                                - {moment(appointment.endDate).format("hh:mm")}
                              </p>
                            </div>
                            <p>
                              <div className={styles.status}>
                                {appointment.status === "WAITING" ? (
                                  <Tooltip title="en attente">
                                    <HourglassEmptyIcon
                                      fontSize="medium"
                                      style={{
                                        color: "white",
                                        backgroundColor: "transparent",
                                      }}
                                      className={styles.icon}
                                    />
                                  </Tooltip>
                                ) : appointment.status === "CONFIRMED" ? (
                                  <Tooltip title="confirmé">
                                    <DoneIcon
                                      fontSize="medium"
                                      style={{
                                        color: "white",
                                        backgroundColor: "transparent",
                                      }}
                                      className={styles.icon}
                                    />
                                  </Tooltip>
                                ) : appointment.status === "MISSED" ? (
                                  <Tooltip title="confirmé">
                                    <CallMissedIcon
                                      fontSize="medium"
                                      style={{
                                        color: "white",
                                        backgroundColor: "transparent",
                                      }}
                                      className={styles.icon}
                                    />
                                  </Tooltip>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </p>
                          </div>
                          <div className="row">
                            <p>
                              <PersonOutlineIcon fontSize="small" />
                            </p>
                            &nbsp;
                            <p>{appointment.patient.user.name}</p>
                          </div>

                          <div className={styles.controls}>
                            <Tooltip title="modifier le rendez-vous">
                              <EditIcon
                                onClick={() => {
                                  setAppointment(appointment);
                                  setAction("MODIFY_APPOINTMENT");
                                  toggleModal();
                                }}
                                fontSize="medium"
                                style={{
                                  color: "white",
                                  backgroundColor: "transparent",
                                }}
                                className={styles.icon}
                              />
                            </Tooltip>
                            <Tooltip title="annuler le rendez-vous">
                              <DeleteIcon
                                onClick={() => {
                                  setAppointment(appointment);
                                  setAction("DELETE_APPOINTMENT");
                                  toggleModal();
                                }}
                                fontSize="medium"
                                style={{
                                  color: "white",
                                  backgroundColor: "transparent",
                                }}
                                className={styles.icon}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </>
                    );
                })}
                {cell.status === "FREE" ? (
                  <div key={cell._id + "*"} className={styles.controls}>
                    <div className={styles.add}>
                      <Tooltip title="nouveau rendez-vous">
                        <CalendarMonthIcon
                          onClick={() => {
                            setCell(cell);
                            setAction("ADD_APPOINTMENT");
                            toggleModal();
                          }}
                          color="secondary"
                          className={styles.icon}
                        />
                      </Tooltip>
                    </div>
                    <Tooltip title="supprimer la cellule">
                      <DeleteIcon
                        onClick={() => {
                          setCell(cell);
                          setAction("DELETE_CELL");
                          toggleModal();
                        }}
                        fontSize="medium"
                        style={{
                          color: "white",
                          backgroundColor: "transparent",
                        }}
                        className={styles.icon}
                      />
                    </Tooltip>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </DayView.TimeTableCell>
    );
  };
  const WeekViewTimeScaleLabel = ({ style, ...restProps }) => (
    <WeekView.TimeScaleLabel
      {...restProps}
      style={{ ...style, height: `250px`, lineHeight: "1rem" }}
    />
  );
  const DayViewTimeScaleLabel = ({ style, ...restProps }) => (
    <DayView.TimeScaleLabel
      {...restProps}
      style={{ ...style, height: `250px`, lineHeight: "1rem" }}
    />
  );

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={toggleModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 50,
        }}
      >
        <Fade in={modalOpen}>
          <div
            className={
              modalOpen
                ? action === "ADD_APPOINTMENT" ||
                  action === "MODIFY_APPOINTMENT"
                  ? "modal big open"
                  : "modal small open"
                : "modal small"
            }
          >
            {action === "DELETE_CELL" ? (
              <DeleteCell fetchCalendar={fetchCalendar} cell={cell} />
            ) : action === "ADD_CELL" ? (
              <AddCell
                types={types}
                fetchCalendar={fetchCalendar}
                cellInfo={cellInfo}
                calendarId={calendar._id}
              />
            ) : action === "ADD_APPOINTMENT" ? (
              <AddAppointment
                cell={cell}
                calendar={calendar}
                patients={patients}
                userInfo={userInfo}
                currentDoctor={currentDoctor}
                fetchCalendar={fetchCalendar}
                fetchPatients={fetchPatients}
              />
            ) : action === "DELETE_APPOINTMENT" ? (
              <DeleteAppointment
                appointment={appointment}
                fetchCalendar={fetchCalendar}
              />
            ) : action === "MODIFY_APPOINTMENT" ? (
              <ModifyAppointment
                appointment={appointment}
                patients={patients}
                userInfo={userInfo}
                currentDoctor={currentDoctor}
                types={types}
                fetchCalendar={fetchCalendar}
                fetchPatients={fetchPatients}
                calendar={{ ...calendar, spots: "" }}
              />
            ) : null}
          </div>
        </Fade>
      </Modal>

      <Layout>
        {loading ? (
          <div className="spinner">
            <CircularProgress />
          </div>
        ) : calendar.spots ? (
          <>
            <div className={styles.row}>
              <div className={styles.col80}>
                <Scheduler locale="fr-FR">
                  <ViewState
                    currentViewName={currentViewName}
                    onCurrentViewNameChange={currentViewChange}
                    currentDate={
                      currentViewName === "WEEK"
                        ? period.startDate
                        : dayPeriod.startDate
                    }
                    onCurrentDateChange={(newItem) => {
                      setPeriod({
                        startDate: moment(newItem)
                          .startOf("week")
                          .format("yyyy-MM-DDThh:mm"),
                        endDate: moment(newItem)
                          .endOf("week")
                          .format("yyyy-MM-DDThh:mm"),
                      });
                      setDayPeriod({
                        startDate: moment(newItem).format("yyyy-MM-DDThh:mm"),
                        endDate: moment(newItem).format("yyyy-MM-DDThh:mm"),
                      });
                    }}
                  />
                  <WeekView
                    cellDuration={calendar.cellDuration}
                    startDayHour={calendar.startDayHour}
                    endDayHour={calendar.endDayHour}
                    excludedDays={
                      userInfo.role == "SUPER-ADMIN"
                        ? currentEstablishment.weekend
                        : userInfo.weekend
                    }
                    timeScaleLabelComponent={WeekViewTimeScaleLabel}
                    timeTableCellComponent={WeekTimeTableCell}
                  />
                  <DayView
                    cellDuration={calendar.cellDuration}
                    startDayHour={calendar.startDayHour}
                    endDayHour={calendar.endDayHour}
                    excludedDays={
                      userInfo.role == "SUPER-ADMIN"
                        ? currentEstablishment.weekend
                        : userInfo.weekend
                    }
                    timeScaleLabelComponent={DayViewTimeScaleLabel}
                    timeTableCellComponent={DayTimeTableCell}
                  />
                  <Toolbar />
                  <DateNavigator />
                  <TodayButton />
                  <ViewSwitcher />
                </Scheduler>
              </div>
              <div className={styles.col20}>
                <div className={styles.container}>
                  <h1>Filtrer</h1>
                  <form>
                    <label className="label">
                      <h2>patient</h2>
                    </label>
                    <Select
                      style={{ width: "100%", textTransform: "capitalize" }}
                      variant="standard"
                      onChange={(e) => setPatient(e.target.value)}
                      className="dateInput"
                      value={patient}
                    >
                      <MenuItem value={"TOUS"}>TOUS</MenuItem>
                      {patients?.map((patient) => {
                        return (
                          <MenuItem
                            style={{ textTransform: "capitalize" }}
                            key={patient._id}
                            value={patient}
                          >
                            {patient.user.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <br />
                    <label className="label">
                      <h2>type</h2>
                    </label>
                    <Select
                      multiple
                      onChange={(e) => {
                        setChecked(
                          typeof e.target.value === "string"
                            ? e.target.value.split("-")
                            : e.target.value
                        );
                      }}
                      style={{ width: "100%" }}
                      className="dateInput"
                      variant="standard"
                      value={checked}
                      renderValue={(selected) =>
                        checked.length === 1
                          ? "TOUS"
                          : selected.filter((x) => x !== "TOUS").join(" - ")
                      }
                    >
                      <div
                        onClick={() => {
                          setChecked(["TOUS"]);
                        }}
                        className={
                          checked.length === 1 ? "activeListItem" : "listItem"
                        }
                      >
                        <ListItemText primary={"TOUS"} />
                      </div>
                      {types?.map((type) => {
                        return (
                          <MenuItem key={type._id} value={type.name}>
                            <Checkbox
                              checked={checked.indexOf(type.name) > -1}
                            />
                            <ListItemText primary={type.name} />
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </form>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ justifyContent: "left" }} className={styles.row}>
            <h2>
              Aucune configuration pour le docteur{" "}
              {currentDoctor.user !== undefined
                ? currentDoctor.user.name
                : currentDoctor.name}
              .
            </h2>
          </div>
        )}
      </Layout>
    </>
  );
}

export default Agenda;
