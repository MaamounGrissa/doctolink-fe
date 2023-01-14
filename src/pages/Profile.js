import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Profile.module.css";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import { compressImage } from "../config/config";

function Profile(props) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    avatar: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const { id, avatar, name, email, phone, password, confirmPassword } = {
    ...formData,
  };

  useEffect(() => {
    if (userInfo) setFormData({ ...userInfo });
  }, [userInfo]);

  const modifyUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword)
      return (
        enqueueSnackbar("passwords doesn't match !", {
          variant: "warning",
        }),
        setLoading(false)
      );
    try {
      const { data } = await axios.post(`/editProfile/${id}`, formData);
      enqueueSnackbar("user edited successfully", { variant: "success" });
      setLoading(false);
      dispatch({ type: "USER_LOGIN", payload: data });
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setLoading(false);
    }
  };

  const onChange = async (event) => {
    const file = event.target.files[0];
    const image = await compressImage(file);
    setFormData({ ...formData, avatar: image });
  };

  return (
    <section className={styles.container}>
      <div className={styles.profile}>
        <img
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/" + "./icons/user.webp";
          }}
          style={{ marginBottom: "20px" }}
          src={
            avatar && avatar !== ""
              ? avatar
              : userInfo?.avatar
              ? userInfo.avatar
              : ""
          }
          alt="profile"
        />
        <h1>{userInfo.name}</h1>
        <label
          htmlFor="avatar"
          style={{ fontWeight: "600", fontSize: "16px" }}
          className="defaultBtn"
        >
          télécharger photo
        </label>
      </div>
      <form onSubmit={modifyUser} className={styles.form}>
        <input
          onChange={onChange}
          id="avatar"
          hidden
          type="file"
          accept="image/*"
        />
        <input
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
          }}
          value={email}
          placeholder="email"
          type="email"
          className="defaultInput"
        />
        <input
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
          value={name}
          placeholder="nom et prénom"
          type="text"
          className="defaultInput"
        />
        <input
          onChange={(e) => {
            setFormData({ ...formData, phone: e.target.value });
          }}
          value={phone}
          placeholder="téléphone"
          type="number"
          className="defaultInput"
        />
        <input
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
          }}
          value={password}
          placeholder="mot de passe"
          type="password"
          className="defaultInput"
          autoComplete="new-password"
        />
        <input
          onChange={(e) => {
            setFormData({ ...formData, confirmPassword: e.target.value });
          }}
          value={confirmPassword}
          placeholder="confirmer mot de passe"
          type="password"
          className="defaultInput"
        />
        {loading ? (
          <div className="spinner">
            <CircularProgress />
          </div>
        ) : (
          <button style={{ width: "100%" }} className="secondBtn">
            enregister
          </button>
        )}
      </form>
    </section>
  );
}

export default Profile;
