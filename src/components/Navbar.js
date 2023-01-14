import React, { useEffect, useState } from "react";
import styles from "../styles/Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SettingsIcon from "@mui/icons-material/Settings";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import { Badge } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Drawer from "@mui/material/Drawer";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { io } from "socket.io-client";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";

function Layout(props) {
  const { userInfo, currentDoctor, currentEstablishment, chatcount } =
    useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [state, setState] = useState({ doctors: [], establishments: [] });
  const { doctors, establishments } = { ...state };
  const [openSelector, setOpenSelector] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    const { data } = await axios.post(
      `/establishments/getbyest/${userInfo.establishment}`
    );
    if (currentDoctor === null) {
      dispatch({ type: "SET_CURRENT_DOCTOR", payload: data[0] });
    }
    setState({ ...state, doctors: data });
  };

  const fetchEstablishments = async () => {
    const { data } = await axios.post(`/establishment/getforpatient`, {
      establishments: userInfo.establishments,
    });
    if (currentEstablishment === null) {
      dispatch({ type: "SET_CURRENT_ESTABLISHMENT", payload: data[0] });
    }
    setState({ ...state, establishments: data });
  };

  const fetchUnreadCount = async () => {
    const { data } = await axios.get(
      `/messenger/getunread/${userInfo?.establishment}`
    );
    dispatch({ type: "UPDATE_CHATCOUNT", payload: data });
  };

  const fetchUnreadCountPatient = async () => {
    const { data } = await axios.get(
      `/messenger/getunreadpatient/${userInfo.id}`
    );
    dispatch({ type: "UPDATE_CHATCOUNT", payload: data });
  };

  const fetchDemandsCount = async () => {
    var doctorId = null;
    if (userInfo?.role === "DOCTOR") {
      doctorId = userInfo._id;
    }
    const { data } = await axios.post(
      `/kpi/getdemandscount/${userInfo.establishment}`,
      { doctorId: doctorId }
    );
    dispatch({ type: "UPDATE_DEMANDS", payload: data });
  };

  const fetchCancelsCount = async () => {
    var doctorId = null;

    if (userInfo?.role === "DOCTOR") {
      doctorId = userInfo._id;
    }
    const { data } = await axios.post(
      `/kpi/getcancelscount/${userInfo.establishment}`,
      { doctorId: doctorId }
    );
    dispatch({ type: "UPDATE_CANCELS", payload: data });
  };

  useEffect(() => {
    if (
      userInfo &&
      userInfo?.role !== "PATIENT" &&
      userInfo?.role !== "SUPER-ADMIN"
    ) {
      fetchDemandsCount();
      fetchCancelsCount();
    }
  }, []);

  useEffect(() => {
    if (userInfo?.role === "ADMIN") fetchDoctors();
    if (
      userInfo?.role === "SUPER-ADMIN" &&
      window.location.pathname !== "/" &&
      !window.location.pathname.includes("/establishment")
    )
      fetchDoctors();
    if (userInfo?.role === "DOCTOR")
      dispatch({ type: "SET_CURRENT_DOCTOR", payload: userInfo });
  }, [userInfo]);

  useEffect(() => {
    if (userInfo?.role === "PATIENT") fetchEstablishments();
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      if (userInfo?.role === "PATIENT") {
        var socket = io.connect(process.env.REACT_APP_SERVER_URL);
        // JOIN-ROOM
        socket.emit("join-room", userInfo.id);
        // INCOMING-MESSAGE
        socket.on("update-chat", () => {
          fetchUnreadCountPatient();
        });
        fetchUnreadCountPatient();
      } else if (
        userInfo?.role === "ADMIN" ||
        userInfo?.role === "DOCTOR" ||
        userInfo?.role === "SUPER-ADMIN"
      ) {
        var socket = io.connect(process.env.REACT_APP_SERVER_URL);
        // JOIN-ROOM
        socket.emit("join-room", userInfo.establishment);
        // INCOMING-MESSAGE
        socket.on("update-chat", () => {
          fetchUnreadCount();
        });
        socket.on("update-demands", () => {
          fetchCancelsCount();
          fetchDemandsCount();
        });
        fetchUnreadCount();
      }
    }
  }, [userInfo]);

  return (
    <>
      {userInfo?.role === "PATIENT" ? (
        <>
          <Drawer
            sx={{ zIndex: "2001" }}
            open={open}
            onClose={() => setOpen(!open)}
            anchor="bottom"
          >
            <div className={styles.drawer}>
              <Link to="/profile">
                <div className={styles.avatar}>
                  <img
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/" + "./icons/user.webp";
                    }}
                    style={{
                      cursor: "pointer",
                      marginBottom: "20px",
                    }}
                    src={userInfo.avatar ? userInfo.avatar : ""}
                    alt="profile"
                  />
                  <p style={{ color: "black" }}>{userInfo.name}</p>
                </div>
              </Link>
              <div className="selector">
                <button
                  style={{
                    cursor: !window.location.pathname.includes(
                      "/doctors/calendar/"
                    )
                      ? "pointer"
                      : "default",
                    opacity: !window.location.pathname.includes(
                      "/doctors/calendar/"
                    )
                      ? 1
                      : 0.5,
                  }}
                  onClick={() => {
                    if (
                      !window.location.pathname.includes("/doctors/calendar/")
                    )
                      setOpenSelector(!openSelector);
                  }}
                  className={styles.select}
                >
                  {currentEstablishment?.name}
                  {openSelector ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </button>
                <div
                  className={
                    openSelector
                      ? `${styles.selectorMenu} + ${styles.open}`
                      : `${styles.selectorMenu} + ${styles.closed}`
                  }
                >
                  {establishments.map((establishment) => {
                    return (
                      <p
                        onClick={async () => {
                          setState({ ...state, loading: true });
                          setOpenSelector(!openSelector);
                          dispatch({
                            type: "SET_CURRENT_ESTABLISHMENT",
                            payload: establishment,
                          });
                          setState({ ...state, loading: false });
                        }}
                        key={establishment._id}
                      >
                        {establishment.name}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <Link to="/doctors">
                  <div className="row">
                    <AddCircleIcon
                      color="secondary"
                      fontSize="medium"
                      style={{ cursor: "pointer" }}
                    />
                    &nbsp;
                    <p>Nouveau rendez-vous</p>
                  </div>
                </Link>
                <HashLink to="/#filter">
                  <div className="row">
                    <SearchIcon
                      color="secondary"
                      fontSize="medium"
                      style={{ cursor: "pointer" }}
                    />
                    &nbsp;
                    <p>Recherche docteurs</p>
                  </div>
                </HashLink>
                <Link to="/dashboard">
                  <Tooltip title="mes rendez-vous">
                    <div className="row">
                      <CalendarMonthIcon
                        color="secondary"
                        fontSize="medium"
                        style={{ cursor: "pointer" }}
                      />
                      &nbsp;
                      <p>Mes rendez-vous</p>
                    </div>
                  </Tooltip>
                </Link>
                <Link to="/messenger">
                  <div className="row">
                    <Badge
                      badgeContent={chatcount}
                      style={{ color: "white" }}
                      color="third"
                    >
                      <MailOutlineIcon
                        color="secondary"
                        fontSize="medium"
                        style={{ cursor: "pointer" }}
                      />
                    </Badge>
                    &nbsp;
                    <p>Messenger</p>
                  </div>
                </Link>
                <div>
                  <div className="row">
                    <LogoutIcon color="fourth" />
                    &nbsp;
                    <p
                      onClick={() => {
                        dispatch({ type: "USER_LOGOUT" });
                        dispatch({
                          type: "SET_CURRENT_ESTABLISHMENT",
                          payload: null,
                        });
                        navigate("/");
                      }}
                    >
                      déconnexion
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Drawer>
          <div className={styles.bottomMenu}>
            <MenuIcon
              onClick={() => setOpen(!open)}
              color="secondary"
              fontSize="medium"
              style={{ cursor: "pointer" }}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/doctors">
              <Tooltip title="nouveau rendez-vous">
                <AddCircleIcon
                  color="secondary"
                  fontSize="medium"
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            </Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <HashLink to="/#filter">
              <Tooltip title="recherche docteurs">
                <SearchIcon
                  color="secondary"
                  fontSize="medium"
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            </HashLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div className={styles.homeIcon}>
              <Link to="/">
                <HomeIcon />
              </Link>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/dashboard">
              <Tooltip title="mes rendez-vous">
                <CalendarMonthIcon
                  color="secondary"
                  fontSize="medium"
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            </Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/messenger">
              <Badge
                badgeContent={chatcount}
                style={{ color: "white" }}
                color="third"
              >
                <MailOutlineIcon
                  color="secondary"
                  fontSize="medium"
                  style={{ cursor: "pointer" }}
                />
              </Badge>
            </Link>
            <Link to="/profile">
              <div className={styles.mobileAvatar}>
                <img
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/" + "./icons/user.webp";
                  }}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                  src={userInfo?.avatar ? userInfo.avatar : ""}
                  alt="profile"
                />
              </div>
            </Link>
          </div>
        </>
      ) : null}
      <section className={styles.navbar}>
        <div className={styles.col1}>
          <Link to="/">
            <div className={styles.logo}>
              <img alt="logo" src={"/logo-white.webp"} />
            </div>
          </Link>
        </div>
        {userInfo?.role === "ADMIN" ? (
          <div className={styles.colselect}>
            <div className="selector">
              <button
                style={{
                  cursor:
                    window.location.pathname !== "/" ? "pointer" : "default",
                  opacity: window.location.pathname !== "/" ? 1 : 0.5,
                }}
                onClick={() => {
                  if (window?.location.pathname !== "/")
                    setOpenSelector(!openSelector);
                }}
                className={styles.select}
              >
                {currentDoctor?.user.name}
                {openSelector ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </button>
              <div
                className={
                  openSelector
                    ? `${styles.selectorMenu} + ${styles.open}`
                    : `${styles.selectorMenu} + ${styles.closed}`
                }
              >
                {doctors.map((doctor) => {
                  return (
                    <p
                      onClick={async () => {
                        setState({ ...state, loading: true });
                        setOpenSelector(!openSelector);
                        dispatch({
                          type: "SET_CURRENT_DOCTOR",
                          payload: doctor,
                        });
                        setState({ ...state, loading: false });
                      }}
                      key={doctor._id}
                    >
                      {doctor.user.name}
                    </p>
                  );
                })}
              </div>
            </div>
            &nbsp;&nbsp;
            <Link to="/config">
              <Tooltip title="configuration">
                <SettingsIcon
                  fontSize="medium"
                  style={{ color: "white", cursor: "pointer" }}
                />
              </Tooltip>
            </Link>
          </div>
        ) : (
          <>
            {userInfo?.role === "PATIENT" ? (
              <div className={styles.colselect}>
                <Link to="/doctors">
                  <Tooltip title="nouveau rendez-vous">
                    <AddCircleIcon
                      fontSize="medium"
                      style={{ color: "white", cursor: "pointer" }}
                    />
                  </Tooltip>
                </Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <HashLink to="/#filter">
                  <Tooltip title="recherche docteurs">
                    <SearchIcon
                      fontSize="medium"
                      style={{ color: "white", cursor: "pointer" }}
                    />
                  </Tooltip>
                </HashLink>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <div className="selector">
                  <button
                    style={{
                      cursor: !window.location.pathname.includes(
                        "/doctors/calendar/"
                      )
                        ? "pointer"
                        : "default",
                      opacity: !window.location.pathname.includes(
                        "/doctors/calendar/"
                      )
                        ? 1
                        : 0.5,
                    }}
                    onClick={() => {
                      if (
                        !window.location.pathname.includes("/doctors/calendar/")
                      )
                        setOpenSelector(!openSelector);
                    }}
                    className={styles.select}
                  >
                    {currentEstablishment?.name}
                    {openSelector ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </button>
                  <div
                    className={
                      openSelector
                        ? `${styles.selectorMenu} + ${styles.open}`
                        : `${styles.selectorMenu} + ${styles.closed}`
                    }
                  >
                    {establishments.map((establishment) => {
                      return (
                        <p
                          onClick={async () => {
                            setState({ ...state, loading: true });
                            setOpenSelector(!openSelector);
                            dispatch({
                              type: "SET_CURRENT_ESTABLISHMENT",
                              payload: establishment,
                            });
                            setState({ ...state, loading: false });
                          }}
                          key={establishment._id}
                        >
                          {establishment.name}
                        </p>
                      );
                    })}
                  </div>
                </div>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link to="/dashboard">
                  <Tooltip title="mes rendez-vous">
                    <CalendarMonthIcon
                      fontSize="medium"
                      style={{ color: "white", cursor: "pointer" }}
                    />
                  </Tooltip>
                </Link>
              </div>
            ) : userInfo?.role === "SUPER-ADMIN" &&
              window.location.pathname !== "/" &&
              !window.location.pathname.includes("establishment") ? (
              <div className={styles.colselect}>
                <Link to="/">
                  <Tooltip title="retour au établissement">
                    <MapsHomeWorkIcon sx={{ color: "white" }} />
                  </Tooltip>
                </Link>
                &nbsp;&nbsp;&nbsp;
                <div className="selector">
                  <button
                    style={{
                      cursor:
                        window.location.pathname !== "/"
                          ? "pointer"
                          : "default",
                      opacity: window.location.pathname !== "/" ? 1 : 0.5,
                    }}
                    onClick={() => {
                      if (window?.location.pathname !== "/")
                        setOpenSelector(!openSelector);
                    }}
                    className={styles.select}
                  >
                    {currentDoctor?.user.name}
                    {openSelector ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </button>
                  <div
                    className={
                      openSelector
                        ? `${styles.selectorMenu} + ${styles.open}`
                        : `${styles.selectorMenu} + ${styles.closed}`
                    }
                  >
                    {doctors.map((doctor) => {
                      return (
                        <p
                          onClick={async () => {
                            setState({ ...state, loading: true });
                            setOpenSelector(!openSelector);
                            dispatch({
                              type: "SET_CURRENT_DOCTOR",
                              payload: doctor,
                            });
                            setState({ ...state, loading: false });
                          }}
                          key={doctor._id}
                        >
                          {doctor.user.name}
                        </p>
                      );
                    })}
                  </div>
                </div>
                &nbsp;&nbsp;
                <Link to="/config">
                  <Tooltip title="configuration">
                    <SettingsIcon
                      fontSize="medium"
                      style={{ color: "white", cursor: "pointer" }}
                    />
                  </Tooltip>
                </Link>
              </div>
            ) : null}
          </>
        )}
        <div className={styles.col2}>
          {userInfo ? (
            <>
              {userInfo?.role !== "SUPER-ADMIN" ? (
                <>
                  {userInfo?.role === "PATIENT" ? (
                    <>
                      <Link style={{ marginRight: "30px" }} to="/messenger">
                        <Badge
                          badgeContent={chatcount}
                          style={{ color: "white" }}
                          color="third"
                        >
                          <MailOutlineIcon
                            fontSize="medium"
                            style={{ color: "white", cursor: "pointer" }}
                          />
                        </Badge>
                      </Link>
                    </>
                  ) : null}
                  <Link style={{ marginRight: "20px" }} to="/profile">
                    <div className={styles.avatar}>
                      <img
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/" + "./icons/user.webp";
                        }}
                        style={{ cursor: "pointer", marginBottom: "20px" }}
                        src={userInfo.avatar ? userInfo.avatar : ""}
                        alt="profile"
                      />
                      <p>{userInfo.name}</p>
                    </div>
                  </Link>
                </>
              ) : null}
              &nbsp;
              <h2
                onClick={() => {
                  dispatch({ type: "USER_LOGOUT" });
                  dispatch({
                    type: "SET_CURRENT_ESTABLISHMENT",
                    payload: null,
                  });
                  navigate("/");
                }}
              >
                déconnexion
              </h2>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </>
          ) : (
            <>
              <Link to="/register">
                <h2>s'inscrire</h2>
              </Link>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Link to="/login">
                <h2>se connecter</h2>
              </Link>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Layout;
