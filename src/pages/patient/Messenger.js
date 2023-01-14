import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../styles/admin/Messenger.module.css";
import { CircularProgress, useMediaQuery } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import moment from "moment";
import SendIcon from "@mui/icons-material/Send";
import { sendMessage } from "../../utils/Messenger.js";
import { io } from "socket.io-client";
import BusinessIcon from "@mui/icons-material/Business";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function Messenger(props) {
  const { userInfo, room } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);
  const bottomRef = useRef();

  const dispatch = useDispatch();

  const scrollToBottom = () => {
    bottomRef?.current?.scrollIntoView();
  };

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(
        `/messenger/getroomsbypatient/${userInfo.id}`
      );
      setRooms(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const fetchRoom = async (id) => {
    try {
      const { data } = await axios.get(`/messenger/getroompatient/${id}`);
      dispatch({ type: "UPDATE_ROOM", payload: data });
      setChatLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const fetchUnreadCountPatient = async () => {
    const { data } = await axios.get(
      `/messenger/getunreadpatient/${userInfo.id}`
    );
    dispatch({ type: "UPDATE_CHATCOUNT", payload: data });
  };

  const send = async () => {
    try {
      if (message.length > 0) {
        await sendMessage(
          userInfo.id,
          room.messages[room.messages.length - 1].sender.role !== "PATIENT"
            ? room.messages[room.messages.length - 1].sender._id
            : room.messages[room.messages.length - 1].receiver._id,
          message,
          room.establishment._id,
          room.patient._id
        );
        setMessage("");
        fetchUnreadCountPatient();
        fetchRooms();
        fetchRoom(room._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchUnreadCountPatient();
      scrollToBottom();
    }, 1);
  }, [room]);

  useEffect(() => {
    fetchRooms();
    dispatch({ type: "UPDATE_ROOM", payload: null });
  }, []);

  useEffect(() => {
    if (userInfo?.role === "PATIENT") {
      var socket = io.connect(process.env.REACT_APP_SERVER_URL);
      // JOIN-ROOM
      socket.emit("join-room", userInfo?.id);
      // INCOMING-MESSAGE
      socket.on("update-chat", () => {
        if (window.location.pathname.includes("messenger")) {
          fetchRooms();
          room && fetchRoom(room._id);
        }
      });
    }
  }, [userInfo, window]);

  return (
    <>
      <Navbar />
      <div className={`${styles.container} + ${styles.patientPage}`}>
        <div className={styles.col30}>
          {loading ? (
            <div className="spinner">
              <CircularProgress />
            </div>
          ) : (
            <>
              {rooms.length < 1 ? (
                <div className={styles.room}>
                  <p>il n'y a aucune discussion pour le moment.</p>
                </div>
              ) : (
                rooms
                  .sort((a, b) =>
                    a.updatedAt > b.updatedAt
                      ? -1
                      : b.updatedAt > b.updatedAt
                      ? 1
                      : 0
                  )
                  .map((room) => {
                    return (
                      <div
                        key={room._id}
                        onClick={() => {
                          setChatLoading(true);
                          fetchRoom(room._id);
                          fetchRooms();
                        }}
                        className={
                          room.messages[room.messages.length - 1].read ||
                          room.messages[room.messages.length - 1].sender
                            .role === "PATIENT"
                            ? `${styles.room} + ${styles.read}`
                            : `${styles.room} + ${styles.unread}`
                        }
                      >
                        <div className={styles.col25}>
                          <div className={styles.icon}>
                            <BusinessIcon color="secondary" />
                          </div>
                        </div>
                        <div className={styles.col75}>
                          <div className={styles.row}>
                            <p>{room.establishment.name}</p>
                            <p>
                              {moment(
                                room.messages[room.messages.length - 1].date
                              ).format("yyyy-MM-DD  / hh:mm")}
                            </p>
                          </div>
                          <h1
                            style={
                              room.messages[room.messages.length - 1].read ||
                              room.messages[room.messages.length - 1].sender
                                .role === "PATIENT"
                                ? { fontWeight: "300" }
                                : null
                            }
                          >
                            {room.messages[room.messages.length - 1].text
                              .length > 20
                              ? room.messages[
                                  room.messages.length - 1
                                ].text.slice(0, 20) + "..."
                              : room.messages[room.messages.length - 1].text}
                          </h1>
                        </div>
                      </div>
                    );
                  })
              )}
            </>
          )}
        </div>
        <div className={styles.col70}>
          {room === null ? (
            <div className={styles.chatImg}>
              <img src={"./chat.webp"} />
            </div>
          ) : chatLoading ? (
            <div className="spinner">
              <CircularProgress />
            </div>
          ) : (
            <div className={styles.chat}>
              <div className={styles.chatHead}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <div className={styles.icon}>
                    <BusinessIcon color="secondary" />
                  </div>
                  &nbsp; &nbsp;
                  <p>{room.establishment.name}</p>
                </div>
                <div className={styles.mobileVisible}>
                  <ArrowBackIosIcon
                    onClick={() => {
                      dispatch({ type: "UPDATE_ROOM", payload: null });
                    }}
                    color="primary"
                  />
                </div>
              </div>
              <div className={styles.chatBody}>
                {room.messages.map((message) => {
                  return (
                    <div
                      key={message._id}
                      style={
                        message.sender.role === "PATIENT"
                          ? { justifyContent: "flex-end" }
                          : { justifyContent: "flex-start" }
                      }
                      className={styles.messageRow}
                    >
                      <div
                        className={
                          message.sender.role === "PATIENT"
                            ? `${styles.message} + ${styles.sender}`
                            : `${styles.message} + ${styles.receiver}`
                        }
                      >
                        {message.text}
                      </div>
                    </div>
                  );
                })}
                <span ref={bottomRef}></span>
              </div>
              <div className={styles.chatFooter}>
                <textarea
                  value={message}
                  onKeyDownCapture={(e) => {
                    if (e.keyCode === 13 && !e.shiftKey) {
                      send();
                    }
                  }}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  required
                  placeholder="ecrivez votre message..."
                />
                <span
                  style={{
                    marginLeft: "-30px",
                    marginTop: "20px",
                    cursor: "pointer",
                    zIndex: "100",
                  }}
                >
                  <SendIcon onClick={() => send()} color="primary" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Messenger;
