import React from "react";
import styles from "../../../styles/admin/Layout.module.css";
import Sidebar from "./Sidebar";
import Navbar from "../../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";

function Layout(props) {
  const { sidemenu } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={sidemenu ? styles.col15 : styles.col0}>
          <Sidebar />
        </div>
        <div className={sidemenu ? styles.col85 : styles.col100}>
          {props.children}
        </div>
      </div>
    </>
  );
}

export default Layout;
