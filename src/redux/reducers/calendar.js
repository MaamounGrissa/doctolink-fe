import { UPDATE_CALENDAR } from "../actions";

const calendarReducer = (
  state = {
    calendar: localStorage.getItem("calendar")
      ? JSON.parse(localStorage.getItem("calendar"))
      : null,
  },
  action
) => {
  switch (action.type) {
    case UPDATE_CALENDAR:
      localStorage.setItem("calendar", JSON.stringify(action.payload));
      return { ...state, calendar: action.payload };
    default:
      return state;
  }
};
export default calendarReducer;
