import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";

function Layout(props) {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "70vh" }}>{props.children}</div>
      {userInfo ? null : <Footer />}
    </>
  );
}

export default Layout;
