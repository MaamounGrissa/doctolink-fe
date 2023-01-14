import React from "react";
import Layout from "../../components/Layout";
import Profile from "../Profile";

function PatientProfile(props) {
  return (
    <Layout>
      <div style={{ padding: "120px 0px" }}>
        <Profile />
      </div>
    </Layout>
  );
}

export default PatientProfile;
