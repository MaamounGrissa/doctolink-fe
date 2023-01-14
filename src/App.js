import { Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import axios from "axios";
import { getUrl } from "./config/config";
import { useDispatch, useSelector } from "react-redux";
import {
  disconnectedRoutes,
  patientRoutes,
  doctorRoutes,
  superAdminRoutes,
  adminRoutes,
} from "./routes";
import { useState, useEffect } from "react";
import { AppContext } from "./utils/AppContext";
import io from "socket.io-client";
import { useMediaQuery } from "@mui/material";

function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery("(max-width:900px)");

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = getUrl();
  axios.defaults.headers.common["Authorization"] = userInfo?.token;

  const theme = createTheme({
    palette: {
      primary: {
        main: "#056AB1",
      },
      secondary: {
        main: "#06CB90",
      },
      third: {
        main: "#06CB90",
      },
      fourth: {
        main: "#cb0664",
      },
    },
  });

  const [modalOpen, setmodalOpen] = useState(false);

  const toggleModal = () => {
    setmodalOpen(!modalOpen);
  };

  useEffect(() => {
    var socket = io.connect(process.env.REACT_APP_SERVER_URL);
    socket.on("update-chat", () => {
      console.log("chat-updated");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);

  return (
    <AppContext.Provider value={{ toggleModal, modalOpen }}>
      <SnackbarProvider
        anchorOrigin={
          isMobile
            ? { vertical: "top", horizontal: "center" }
            : { vertical: "bottom", horizontal: "right" }
        }
      >
        <ThemeProvider theme={theme}>
          <Routes>
            {userInfo?.role === "SUPER-ADMIN"
              ? superAdminRoutes
              : userInfo?.role === "ADMIN"
              ? adminRoutes
              : userInfo?.role === "DOCTOR"
              ? doctorRoutes
              : userInfo?.role === "PATIENT"
              ? patientRoutes
              : disconnectedRoutes}
          </Routes>
        </ThemeProvider>
      </SnackbarProvider>
    </AppContext.Provider>
  );
}

export default App;
