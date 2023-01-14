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
import calendarStyles from "../styles/admin/Calendar.module.css";
import styles from "../styles/disconnected/DoctorsCalendar.module.css";
import {
  Backdrop,
  CircularProgress,
  useMediaQuery,
  Modal,
  Fade,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import moment from "moment";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import Tooltip from "@mui/material/Tooltip";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../utils/AppContext";

function DoctorCalendar(props) {
  const isMobile = useMediaQuery("( max-width:900px)");
  const { enqueueSnackbar } = useSnackbar();
  let navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useState({
    calendar: {},
    loading: true,
  });
  const [appointment, setAppointment] = useState({
    doctor: "",
    date: "",
    start: "",
    end: "",
    type: "",
    color: "",
  });
  const { color, date, start, end, type } = { ...appointment };

  const { currentEstablishment } = useSelector((state) => state.auth);

  const [demand, setDemand] = useState({});

  const [action, setAction] = useState("");

  const [cellId, setCellId] = useState("");

  const [period, setPeriod] = useState({
    startDate: moment().startOf("week").format("yyyy-MM-DDThh:mm"),
    endDate: moment().endOf("week").format("yyyy-MM-DDThh:mm"),
  });

  const [currentViewName, setCurrentViewName] = useState("Week");

  const [dayPeriod, setDayPeriod] = useState({
    startDate: moment().format("yyyy-MM-DDThh:mm"),
    endDate: moment().format("yyyy-MM-DDThh:mm"),
  });

  const currentViewChange = () => {
    currentViewName === "Week"
      ? setCurrentViewName("Day")
      : setCurrentViewName("Week");
  };

  const [myDemands, setMyDemands] = useState([]);

  const { loading, calendar } = { ...state };

  const { toggleModal, modalOpen } = useContext(AppContext);

  const { userInfo } = useSelector((state) => state.auth);

  const fetchCalendar = async () => {
    try {
      const { data } = await axios.post(`/calendar/getbydoctor/${id}`, period);
      setState({ ...state, calendar: data.calendar, loading: false });
    } catch (error) {
      setState({ ...state, loading: false });
      if (error.response.data.message)
        enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const sendDemand = async () => {
    try {
      await axios.post(`/demand/add/${currentEstablishment._id}`, demand);
      enqueueSnackbar("demande de rendez vous envoyée", { variant: "info" });
      fetchCalendar();
      getMyDemands();
      toggleModal();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      fetchCalendar();
      toggleModal();
    }
  };

  const cancelDemand = async () => {
    try {
      await axios.delete(`/demand/cancel/${cellId}`);
      enqueueSnackbar("demande de rendez vous annulée", { variant: "warning" });
      fetchCalendar();
      getMyDemands();
      toggleModal();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const getMyDemands = async () => {
    const { data } = await axios.get(`/demand/get/${userInfo._id}`);
    setMyDemands(data);
  };

  useEffect(() => {
    setState({ ...state, loading: true });
    fetchCalendar();
    getMyDemands();
  }, [id, period]);

  const WeekTimeTableCell = ({ ...restProps }) => {
    const startDate = restProps.startDate;
    const cells = calendar.spots.filter(
      (spot) =>
        spot.startDate === moment(startDate).format("yyyy-MM-DDTHH:mm") &&
        spot.status === "FREE" &&
        spot.type.online
    );
    return (
      <WeekView.TimeTableCell className={calendarStyles.cell}>
        <div className={calendarStyles.spotsContainer}>
          {cells.map((cell) => {
            return (
              <div
                key={cell._id}
                className={calendarStyles.spot}
                style={{
                  backgroundColor: moment().isAfter(
                    moment(startDate).add(calendar.cellDuration, "minutes"),
                    "minutes"
                  )
                    ? "#b10505"
                    : "#05b13e",
                  pointerEvents: moment().isAfter(
                    moment(startDate).add(calendar.cellDuration, "minutes"),
                    "minutes"
                  )
                    ? "none"
                    : "all",
                  opacity:
                    cell.status === "FREE" && !myDemands.includes(cell._id)
                      ? 0.3
                      : 0.8,
                }}
              >
                <div
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className={calendarStyles.controls}
                >
                  {myDemands.includes(cell._id) ? null : (
                    <Tooltip title="prenez rendez-vous">
                      <BookmarkAddIcon
                        onClick={() => {
                          if (userInfo) {
                            setAppointment({
                              ...appointment,
                              doctor: calendar.doctor._id,
                              date: cell.startDate,
                              start: moment(cell.startDate).format("hh:mm"),
                              end: moment(cell.endDate).format("hh:mm"),
                              type: cell.type.name,
                              color: cell.type.color,
                            });
                            setDemand({
                              ...demand,
                              doctor: calendar.doctor._id,
                              calendar: calendar._id,
                              patient: userInfo._id,
                              establishment: userInfo.establishment,
                              reservation: cell._id,
                            });
                            setAction("CREATE");
                            toggleModal();
                          } else {
                            navigate("/login");
                            enqueueSnackbar(
                              "Login first to take appointments",
                              { variant: "warning" }
                            );
                          }
                        }}
                        color="secondary"
                        className={calendarStyles.icon}
                      />
                    </Tooltip>
                  )}
                </div>
                {!myDemands.includes(cell._id) ? null : (
                  <div
                    style={{
                      textAlign: "center",
                      position: "absolute",
                      top: "0",
                      left: "0",
                      textTransform: "capitalize",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p style={{ margin: "5px" }}>déjas demandé</p>
                    <Tooltip title="annuler la demande">
                      <EventBusyIcon
                        color="secondary"
                        className={calendarStyles.icon}
                        onClick={() => {
                          setAction("CANCEL");
                          setCellId(cell._id);
                          toggleModal();
                        }}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </WeekView.TimeTableCell>
    );
  };
  const DayTimeTableCell = ({ ...restProps }) => {
    const startDate = restProps.startDate;
    const cells = calendar.spots.filter(
      (spot) =>
        spot.startDate === moment(startDate).format("yyyy-MM-DDTHH:mm") &&
        spot.status === "FREE" &&
        spot.type.online
    );
    return (
      <DayView.TimeTableCell className={calendarStyles.cell}>
        <div className={calendarStyles.spotsContainer}>
          {cells.map((cell) => {
            return (
              <div
                key={cell._id}
                className={calendarStyles.spot}
                style={{
                  backgroundColor: cell.type.color,
                  pointerEvents: moment().isAfter(
                    moment(startDate).add(calendar.cellDuration, "minutes"),
                    "minutes"
                  )
                    ? "none"
                    : "all",
                  opacity:
                    cell.status === "FREE" && !myDemands.includes(cell._id)
                      ? 0.3
                      : 0.8,
                }}
              >
                <div
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className={calendarStyles.controls}
                >
                  {myDemands.includes(cell._id) ? null : (
                    <Tooltip title="prenez rendez-vous">
                      <BookmarkAddIcon
                        onClick={() => {
                          if (userInfo) {
                            setAppointment({
                              ...appointment,
                              doctor: calendar.doctor._id,
                              date: cell.startDate,
                              start: moment(cell.startDate).format("hh:mm"),
                              end: moment(cell.endDate).format("hh:mm"),
                              type: cell.type.name,
                              color: cell.color,
                            });
                            setDemand({
                              ...demand,
                              calendar: calendar._id,
                              doctor: calendar.doctor._id,
                              patient: userInfo._id,
                              establishment: userInfo.establishment,
                              reservation: cell._id,
                            });
                            setAction("CREATE");
                            toggleModal();
                          } else {
                            navigate("/login");
                            enqueueSnackbar(
                              "Login first to take appointments",
                              { variant: "warning" }
                            );
                          }
                        }}
                        color="secondary"
                        className={calendarStyles.icon}
                      />
                    </Tooltip>
                  )}
                </div>
                {!myDemands.includes(cell._id) ? null : (
                  <div
                    style={{
                      textAlign: "center",
                      position: "absolute",
                      top: "0",
                      left: "0",
                      textTransform: "capitalize",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p style={{ margin: "5px" }}>déjas demandé</p>
                    <Tooltip title="annuler la demande">
                      <EventBusyIcon
                        color="secondary"
                        className={calendarStyles.icon}
                        onClick={() => {
                          setAction("CANCEL");
                          setCellId(cell._id);
                          toggleModal();
                        }}
                      />
                    </Tooltip>
                  </div>
                )}
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

  useEffect(() => {
    if (isMobile) setCurrentViewName("Day");
  }, [isMobile]);

  return (
    <Layout>
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
            {action === "CREATE" ? (
              <>
                <h1>voulez-vous prendre ce rendez-vous ?</h1>
                <div style={{ alignItems: "flex-start" }} className="row">
                  <div className="col50 column">
                    <div
                      style={{ marginBottom: "-20px" }}
                      className={styles.row}
                    >
                      <h2>doctor: </h2>&nbsp;
                      <p>{calendar?.doctor?.user?.name}</p>
                    </div>
                    <div
                      style={{ marginBottom: "-20px" }}
                      className={styles.row}
                    >
                      <h2>date: </h2>&nbsp;
                      <p>{moment(date).format("yyyy-MM-DD")}</p>
                    </div>
                    <div
                      style={{
                        marginBottom: "-20px",
                        display: "flex",
                        justifyContent: "flex-start ",
                      }}
                    >
                      <div style={{ width: "auto" }} className={styles.row}>
                        <h2>de: </h2>&nbsp;
                        <p>{start}</p>
                      </div>
                      &nbsp;&nbsp;&nbsp;
                      <div className={styles.row}>
                        <h2>à: </h2>&nbsp;
                        <p>{end}</p>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="col50 column">
                    <div style={{ width: "100%" }} className="labeledInput">
                      <label>motif</label>
                      <textarea
                        onChange={(e) => {
                          setDemand({
                            ...demand,
                            motif: e.target.value,
                          });
                        }}
                        style={
                          isMobile
                            ? { width: "100%", height: "120px" }
                            : { width: "80%", height: "120px" }
                        }
                        className="defaultInput"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <button
                    onClick={() => {
                      sendDemand();
                    }}
                    className="defaultBtn"
                  >
                    confirmer
                  </button>
                  &nbsp;
                  <button
                    onClick={() => {
                      toggleModal();
                    }}
                    className="cancelBtn"
                  >
                    annuler
                  </button>
                </div>
              </>
            ) : action === "CANCEL" ? (
              <>
                <h1>voulez-vous annulez ce rendez-vous ?</h1>
                <div className="row">
                  <button
                    onClick={() => {
                      cancelDemand(cellId);
                    }}
                    className="defaultBtn"
                  >
                    confirmer
                  </button>
                  &nbsp;
                  <button
                    onClick={() => {
                      toggleModal();
                    }}
                    className="cancelBtn"
                  >
                    annuler
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </Fade>
      </Modal>
      <div className={styles.container}>
        <div className={styles.globalRow}>
          {calendar.doctor ? (
            <div className={styles.col30}>
              <div className={styles.card}>
                <div className={styles.profile}>
                  <img
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/" + "./icons/user.webp";
                    }}
                    style={{ marginBottom: "20px" }}
                    src={
                      calendar?.doctor?.user?.avatar
                        ? calendar?.doctor?.user?.avatar
                        : ""
                    }
                    alt="profile"
                  />
                </div>
                <h1>{calendar?.doctor?.user?.name}</h1>
                <div className={styles.row}>
                  <MedicalServicesIcon color="primary" />
                  &nbsp;&nbsp;
                  <p>{calendar?.doctor?.specialty}</p>&nbsp;&nbsp;
                </div>
                <div className={styles.row}>
                  <ApartmentIcon color="primary" />
                  &nbsp;&nbsp;
                  <p>{calendar?.doctor?.establishment?.name}</p>&nbsp;&nbsp;
                  <LocalPhoneIcon color="primary" />
                  &nbsp;&nbsp;
                  <p>{calendar?.doctor?.establishment?.phone}</p>
                </div>
                <div className={styles.row}>
                  <LocationOnIcon color="primary" />
                  &nbsp;&nbsp;
                  <p>{calendar?.doctor?.establishment?.adress}</p>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {loading ? (
            <div className="spinner">
              <CircularProgress />
            </div>
          ) : calendar?.spots ? (
            <div className={styles.col70}>
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
                  excludedDays={currentEstablishment.weekend}
                  timeScaleLabelComponent={WeekViewTimeScaleLabel}
                  timeTableCellComponent={WeekTimeTableCell}
                />
                <DayView
                  cellDuration={calendar.cellDuration}
                  startDayHour={calendar.startDayHour}
                  endDayHour={calendar.endDayHour}
                  excludedDays={currentEstablishment.weekend}
                  timeScaleLabelComponent={DayViewTimeScaleLabel}
                  timeTableCellComponent={DayTimeTableCell}
                />
                <Toolbar />
                <DateNavigator />
                <TodayButton />
                {!isMobile ? <ViewSwitcher /> : null}
              </Scheduler>
            </div>
          ) : (
            <h1>Contactez-nous par téléphone pour plus de détails ....</h1>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default DoctorCalendar;
