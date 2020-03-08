import { SET_USER, REMOVE_USER } from "./actions";
import cookies from "../cookies";

const initialState = {
  username: cookies.getCookie("username"),
  loggedIn: cookies.getCookie("username") ? true : false
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      // update user cookie
      cookies.setCookie("username", action.username );
      return { ...state, username: action.username, loggedIn: true}
    case REMOVE_USER:
      cookies.setCookie("username", "");
      return {...state, username: "", loggedIn: false}
    default:
      return state;
  };
}

export default rootReducer;