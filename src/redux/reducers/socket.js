import { SOCKET_LOGIN, SOCKET_LOGOUT } from "../actions";

const socketReducer = (
  state = {
    socketInfo: localStorage.getItem("socketInfo")
      ? JSON.parse(localStorage.getItem("socketInfo"))
      : null,
  },
  action
) => {
  switch (action.type) {
    case SOCKET_LOGIN:
      localStorage.setItem("socketInfo", JSON.stringify(action.payload));
      return { ...state, socketInfo: action.payload };
    case SOCKET_LOGOUT:
      localStorage.removeItem("socketInfo");
      return { ...state, socketInfo: null };
    default:
      return state;
  }
};
export default socketReducer;
