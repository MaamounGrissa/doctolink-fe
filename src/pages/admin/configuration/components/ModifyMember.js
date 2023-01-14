import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useSelector } from "react-redux";
import { CircularProgress, Select, MenuItem } from "@mui/material";
import moment from "moment";

function ModifyMember(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    doctorId: "",
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const { doctorId, name, email, phone } = { ...formData };
  const [formCalendar, setFormCalendar] = useState({
    doctorId: props.member._id,
    startDate: "",
    endDate: "",
    template: {},
    weekend: "",
    startDayHour: "",
    endDayHour: "",
    adminId: userInfo.id,
  });
  const { startDate, endDate } = { ...formCalendar };
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useState({ loading: true, agendas: [] }); 
  const { loading, agendas } = { ...state };
  const [configured, setConfigured] = useState("");
  const [loadingConfig, setLoadingConfig] = useState(false);

  const modifyDoctor = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/doctor", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      document.getElementById("modifyMember").reset();
      props.fetchMembers();
      toggleModal();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const fetchAgendas = async () => {
    const { data } = await axios.post(
      `/agenda/getactivebyest/${userInfo.establishment}`
    );
    setState({
      ...state,
      agendas: data,
    });
  };

  const fetchConfigured = async () => {
    try {
      const { data } = await axios.post(`/calendar/getconfigured/${doctorId}`);
      setConfigured(data);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const stampCalendar = async (e) => {
    setLoadingConfig(true);
    e.preventDefault();
    if (startDate > endDate) {
      return (
        enqueueSnackbar(
          `la date de début doit être inférieur à celle de fin !`,
          {
            variant: "warning",
          }
        ),
        setLoadingConfig(false)
      );
    } else if (
      (startDate > configured.startDate && startDate < configured.endDate) ||
      (endDate > configured.startDate && endDate < configured.endDate) ||
      endDate === configured.startDate ||
      startDate === configured.endDate
    ) {
      return (
        enqueueSnackbar(
          `notez que vous devez respecter la période déjà configurée ! de: ${configured.startDate} à ${configured.endDate}.`,
          { variant: "warning" }
        ),
        setLoadingConfig(false)
      );
    } else if (
      (startDate < configured.startDate &&
        (moment(endDate).isBefore(
          moment(configured.startDate).subtract(1, "day"),
          "days"
        ) ||
          moment(endDate).isAfter(moment(configured.startDate), "days"))) ||
      (endDate > configured.endDate &&
        (moment(startDate).isAfter(
          moment(configured.endDate).add(1, "day"),
          "days"
        ) ||
          moment(startDate).isBefore(moment(configured.endDate), "days")))
    ) {
      return (
        enqueueSnackbar(
          `impossible de laisser un écart entre la période déja configurée et la nouvelle configuration !`,
          {
            variant: "warning",
          }
        ),
        setLoadingConfig(false)
      );
    }
    try {
      const { data } = await axios.post("/calendar/stamp", formCalendar);
      setLoadingConfig(false);
      enqueueSnackbar(data.message, { variant: "info" });
      fetchConfigured();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setLoadingConfig(false);
    }
  };

  const fetchEstablishment = async () => {
    const { data } = await axios.post(
      `/establishment/${userInfo.establishment}`
    );
    setFormCalendar({
      ...formCalendar,
      weekend: data.weekend,
      startDayHour: data.startHour,
      endDayHour: data.endHour,
    });
  };

  useEffect(() => {
    fetchAgendas();
    if (userInfo) fetchEstablishment();
  }, [props, userInfo]);

  useEffect(() => {
    setFormData({
      ...props.member.user,
      doctorId: props.member._id,
    });
    setFormCalendar({
      ...formCalendar,
      template: agendas[0]?.template,
    });
    setState({
      ...state,
      loading: false,
    });
  }, [agendas]);

  useEffect(() => {
    if (doctorId !== "") fetchConfigured();
  }, [doctorId]);

  return (
    <>
      <h1>modifier le docteur: {props.member.user.name}</h1>
      <form id="modifyMember" onSubmit={modifyDoctor}>
        <div className="row">
          <div className="col50">
            <input
              autoComplete="new-password"
              required
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
              }}
              placeholder="Nom"
              className="defaultInput"
              type="text"
              value={name}
            />
          </div>
          <div className="col50">
            <input
              autoComplete="new-password"
              required
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
              }}
              placeholder="tél"
              className="defaultInput"
              type="number"
              value={phone}
            />
          </div>
        </div>
        <div className="row">
          <div className="col50">
            <input
              autoComplete="new-password"
              required
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
              placeholder="email"
              className="defaultInput"
              type="text"
              value={email}
            />
          </div>
          <div className="col50">
            <input
              autoComplete="new-password"
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
              placeholder="mot de passe"
              className="defaultInput"
              type="password"
            />
          </div>
        </div>
      </form>
      {loading ? (
        <div className="spinner">
          <CircularProgress />
        </div>
      ) : (
        <fieldset style={{ border: "1px solid #ccc", marginTop: "-20px" }}>
          <legend>
            <h2>Appliquer une configuration</h2>
          </legend>
          <form onSubmit={stampCalendar} id="configure">
            <div className="row">
              <div style={{ padding: "0px 20px" }} className="col50">
                <select
                  required
                  className="defaultInput"
                  onChange={(e) => {
                    setFormCalendar({
                      ...formCalendar,
                      template: JSON.parse(e.target.value),
                    });
                  }}
                  style={{ borderRadius: "0px" }}
                >
                  {agendas.map((agenda) =>
                    agenda.template ? (
                      <option
                        key={agenda._id}
                        value={JSON.stringify(agenda.template)}
                      >
                        {agenda.name}
                      </option>
                    ) : null
                  )}
                </select>
              </div>
              <div style={{ padding: "0px 20px" }} className="col50">
                {configured.startDate ? (
                  <p>
                    notez que vous devez respecter la période déjà configurée !
                    de: {configured.startDate} à {configured.endDate}.
                  </p>
                ) : (
                  <p>Aucune configuration pour le moment.</p>
                )}
              </div>
            </div>
            <div className="row">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "0px 20px",
                }}
                className="col50"
              >
                <div className="row">
                  <label>date de début:</label>
                </div>
                <div className="row">
                  <input
                    required
                    type="date"
                    style={{ width: "100%" }}
                    className="dateInput"
                    onChange={(e) => {
                      setFormCalendar({
                        ...formCalendar,
                        startDate: e.target.value,
                      });
                    }}
                    value={startDate}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "0px 20px",
                }}
                className="col50"
              >
                <div className="row">
                  <label>date de fin:</label>
                </div>
                <div className="row">
                  <input
                    required
                    type="date"
                    style={{ width: "100%" }}
                    className="dateInput"
                    onChange={(e) => {
                      setFormCalendar({
                        ...formCalendar,
                        endDate: e.target.value,
                      });
                    }}
                    value={endDate}
                  />
                </div>
              </div>
            </div>
            <div style={{ padding: "0px 20px" }} className="row">
              {loadingConfig ? (
                <CircularProgress color="secondary" />
              ) : (
                <button form="configure" type="submit" className="secondBtn">
                  appliquer
                </button>
              )}
            </div>
          </form>
        </fieldset>
      )}
      <div className="row">
        <button form="modifyMember" type="submit" className="defaultBtn">
          enregister
        </button>
        &nbsp;
        <button
          type="button"
          onClick={() => {
            toggleModal();
          }}
          className="cancelBtn"
        >
          annuler
        </button>
      </div>
    </>
  );
}

export default ModifyMember;
