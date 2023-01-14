import React from "react";
import styles from "../../../styles/admin/Sidebar.module.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ForumIcon from "@mui/icons-material/Forum";
import EventIcon from "@mui/icons-material/Event";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Badge } from "@mui/material";

function Sidebar(props) {
  const { sidemenu, chatcount, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className={sidemenu ? styles.container : styles.closed}>
      <span className={styles.arrow}>
        {sidemenu ? (
          <ArrowBackIosNewIcon
            color="primary"
            onClick={() => {
              dispatch({ type: "TOGGLE_SIDEMENU", payload: !sidemenu });
            }}
          />
        ) : (
          <ArrowForwardIosIcon
            color="primary"
            onClick={() => {
              dispatch({ type: "TOGGLE_SIDEMENU", payload: !sidemenu });
            }}
          />
        )}
      </span>
      <div className={sidemenu ? null : styles.none}>
        <Link
          className={styles.row}
          to={userInfo.role === "SUPER-ADMIN" ? "/admin-space" : "/"}
        >
          <div className={styles.link}>
            <DashboardIcon
              className={
                window.location.pathname === "/" ||
                window.location.pathname === "/admin-space"
                  ? `${styles.icon} + ${styles.active}`
                  : styles.icon
              }
              fontSize="large"
            />
            &nbsp;
            <h1>dashboard</h1>
          </div>
        </Link>
        <Link className={styles.row} to="/agenda">
          <div className={styles.link}>
            <CalendarMonthIcon
              className={
                window.location.pathname.includes("agenda")
                  ? `${styles.icon} + ${styles.active}`
                  : styles.icon
              }
              fontSize="large"
            />
            &nbsp;
            <h1>agenda</h1>
          </div>
        </Link>
        <Link className={styles.row} to="/appointments">
          <div className={styles.link}>
            <FormatListBulletedIcon
              className={
                window.location.pathname.includes("appointments")
                  ? `${styles.icon} + ${styles.active}`
                  : styles.icon
              }
              fontSize="large"
            />
            &nbsp;
            <h1>liste des rdvs</h1>
          </div>
        </Link>
        <Link className={styles.row} to="/patients">
          <div className={styles.link}>
            <RecentActorsIcon
              className={
                window.location.pathname.includes("patients")
                  ? `${styles.icon} + ${styles.active}`
                  : styles.icon
              }
              fontSize="large"
            />
            &nbsp;
            <h1>liste de patients</h1>
          </div>
        </Link>
        <Link className={styles.row} to="/events">
          <div className={styles.link}>
            <EventIcon
              className={
                window.location.pathname.includes("events")
                  ? `${styles.icon} + ${styles.active}`
                  : styles.icon
              }
              fontSize="large"
            />
            &nbsp;
            <h1>journal d’évènement</h1>
          </div>
        </Link>
        <Link className={styles.row} to="/messenger">
          <div className={styles.link}>
            <Badge color="primary" badgeContent={chatcount}>
              <ForumIcon
                className={
                  window.location.pathname.includes("messenger")
                    ? `${styles.icon} + ${styles.active}`
                    : styles.icon
                }
                fontSize="large"
              />
            </Badge>
            &nbsp;
            <h1>messenger</h1>
          </div>
        </Link>
        <div
          onClick={() => {
            dispatch({ type: "USER_LOGOUT" });
          }}
          className={styles.row}
        >
          <Link to="/">
            <div className={`${styles.link} + ${styles.red}`}>
              <LogoutIcon
                className={`${styles.icon} + ${styles.red}`}
                fontSize="large"
              />
              &nbsp;
              <h1>déconnexion</h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
