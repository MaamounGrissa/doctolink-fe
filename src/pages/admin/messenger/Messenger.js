import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/admin/Messenger.module.css";
import layoutStyles from "../../../styles/admin/Layout.module.css";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import moment from "moment";
import SendIcon from "@mui/icons-material/Send";
import { sendMessage } from "../../../utils/Messenger.js";
import { io } from "socket.io-client";

function Messenger() {
  const { sidemenu, userInfo, room } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);
  const bottomRef = useRef();
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView();
  };

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(
        `/messenger/getroomsbyest/${userInfo?.establishment}`
      );
      setRooms(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const fetchRoom = async (id) => {
    try {
      const { data } = await axios.get(`/messenger/getroom/${id}`);
      dispatch({ type: "UPDATE_ROOM", payload: data });
      setChatLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const fetchUnreadCount = async () => {
    const { data } = await axios.get(
      `/messenger/getunread/${userInfo?.establishment}`
    );
    dispatch({ type: "UPDATE_CHATCOUNT", payload: data });
  };

  const send = async () => {
    try {
      if (message.length > 0) {
        await sendMessage(
          userInfo.id,
          room.patient._id,
          message,
          userInfo.establishment,
          room.patient._id
        );
        setMessage("");
        fetchUnreadCount();
        fetchRooms();
        fetchRoom(room._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchUnreadCount();
      scrollToBottom();
    }, 1);
  }, [room]);

  useEffect(() => {
    fetchRooms();
    dispatch({ type: "UPDATE_ROOM", payload: null });
  }, []);

  useEffect(() => {
    if (userInfo?.role !== "PATIENT") {
      var socket = io.connect(process.env.REACT_APP_SERVER_URL);
      // JOIN-ROOM
      socket.emit("join-room", userInfo?.establishment);
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
      <div
        style={
          sidemenu
            ? { padding: "90px 0px", height: "100vh", paddingLeft: "0px" }
            : { padding: "90px 0px", height: "100vh", paddingLeft: "15px" }
        }
        className={layoutStyles.container}
      >
        <div className={sidemenu ? layoutStyles.col15 : layoutStyles.col0}>
          <Sidebar />
        </div>
        <div className={sidemenu ? layoutStyles.col85 : layoutStyles.col100}>
          <div className={styles.container}>
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
                                .role !== "PATIENT"
                                ? `${styles.room} + ${styles.read}`
                                : `${styles.room} + ${styles.unread}`
                            }
                          >
                            <div className={styles.col25}>
                              <img
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/" + "./icons/user.webp";
                                }}
                                src={
                                  room.patient.avatar ? room.patient.avatar : ""
                                }
                                alt="profile"
                              />
                            </div>
                            <div className={styles.col75}>
                              <div className={styles.row}>
                                <p>
                                  {room.messages[room.messages.length - 1]
                                    .sender.role === "PATIENT"
                                    ? room.messages[room.messages.length - 1]
                                        .sender.name
                                    : room.messages[room.messages.length - 1]
                                        .receiver.name}
                                </p>
                                <p>
                                  {moment(
                                    room.messages[room.messages.length - 1].date
                                  ).format("yyyy-MM-DD  / hh:mm")}
                                </p>
                              </div>
                              <h1
                                style={
                                  room.messages[room.messages.length - 1]
                                    .read ||
                                  room.messages[room.messages.length - 1].sender
                                    .role !== "PATIENT"
                                    ? { fontWeight: "300" }
                                    : null
                                }
                              >
                                {room.messages[room.messages.length - 1].text
                                  .length > 20
                                  ? room.messages[
                                      room.messages.length - 1
                                    ].text.slice(0, 20) + "..."
                                  : room.messages[room.messages.length - 1]
                                      .text}
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
                    <div className={styles.profile}>
                      <img
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/" + "./icons/user.webp";
                        }}
                        src={room.patient.avatar ? room.patient.avatar : ""}
                        alt="profile"
                      />
                    </div>
                    <p>
                      {room.messages[room.messages.length - 1].sender.role ===
                      "PATIENT"
                        ? room.messages[room.messages.length - 1].sender.name
                        : room.messages[room.messages.length - 1].receiver.name}
                    </p>
                  </div>
                  <div className={styles.chatBody}>
                    {room.messages.map((message) => {
                      return (
                        <div
                          key={message._id}
                          style={
                            message.sender.role !== "PATIENT"
                              ? { justifyContent: "flex-end" }
                              : { justifyContent: "flex-start" }
                          }
                          className={styles.messageRow}
                        >
                          <div
                            className={
                              message.sender.role !== "PATIENT"
                                ? `${styles.message} + ${styles.sender}`
                                : `${styles.message} + ${styles.receiver}`
                            }
                          >
                            {message.text}
                            {message.sender.role !== "PATIENT" ? (
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "flex-end",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "11px",
                                    backgroundColor: "#f5f5f5",
                                    color: "#000",
                                    padding: "3px",
                                    borderRadius: "5px",
                                  }}
                                >
                                  {message.sender.name}
                                </p>
                              </div>
                            ) : null}
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
        </div>
      </div>
    </>
  );
}

export default Messenger;
