import {
  USER_LOGIN,
  USER_LOGOUT,
  SET_CURRENT_DOCTOR,
  SET_CURRENT_ESTABLISHMENT,
  TOGGLE_SIDEMENU,
  UPDATE_CHATCOUNT,
  UPDATE_ROOM,
  UPDATE_CANCELS,
  UPDATE_DEMANDS,
} from "../actions";

const authReducer = (
  state = {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    currentDoctor: localStorage.getItem("currentDoctor")
      ? JSON.parse(localStorage.getItem("currentDoctor"))
      : null,
    currentEstablishment: localStorage.getItem("currentEstablishment")
      ? JSON.parse(localStorage.getItem("currentEstablishment"))
      : null,
    sidemenu: localStorage.getItem("sidemenu")
      ? JSON.parse(localStorage.getItem("sidemenu"))
      : false,
    chatcount: localStorage.getItem("chatcount")
      ? JSON.parse(localStorage.getItem("chatcount"))
      : false,
    room: localStorage.getItem("room")
      ? JSON.parse(localStorage.getItem("room"))
      : null,
    demandsCount: localStorage.getItem("demandsCount")
      ? JSON.parse(localStorage.getItem("demandsCount"))
      : null,
    cancelsCount: localStorage.getItem("cancelsCount")
      ? JSON.parse(localStorage.getItem("cancelsCount"))
      : null,
  },
  action
) => {
  switch (action.type) {
    case USER_LOGIN:
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };
    case USER_LOGOUT:
      localStorage.removeItem("userInfo");
      localStorage.setItem("currentDoctor", null);
      return { ...state, userInfo: null, currentDoctor: null };
    case SET_CURRENT_DOCTOR:
      localStorage.setItem("currentDoctor", JSON.stringify(action.payload));
      return { ...state, currentDoctor: action.payload };
    case SET_CURRENT_ESTABLISHMENT:
      localStorage.setItem(
        "currentEstablishment",
        JSON.stringify(action.payload)
      );
      return { ...state, currentEstablishment: action.payload };
    case TOGGLE_SIDEMENU:
      localStorage.setItem("sidemenu", JSON.stringify(action.payload));
      return { ...state, sidemenu: action.payload };
    case UPDATE_CHATCOUNT:
      localStorage.setItem("chatcount", JSON.stringify(action.payload));
      return { ...state, chatcount: action.payload };
    case UPDATE_ROOM:
      localStorage.setItem("room", JSON.stringify(action.payload));
      return { ...state, room: action.payload };
    case UPDATE_CANCELS:
      localStorage.setItem("cancelsCount", JSON.stringify(action.payload));
      return { ...state, cancelsCount: action.payload };
    case UPDATE_DEMANDS:
      localStorage.setItem("demandsCount", JSON.stringify(action.payload));
      return { ...state, demandsCount: action.payload };
    default:
      return state;
  }
};
export default authReducer;
