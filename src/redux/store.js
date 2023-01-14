import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import auth from "./reducers/auth";
import socket from "./reducers/socket";

export default configureStore(
  {
    reducer: {
      auth: auth,
      socket: socket,
    },
  },
  applyMiddleware(thunk)
);
