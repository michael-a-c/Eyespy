import { SET_USER } from "./actions";

const initialState = {
  username: "theLegend27",
  otherStuff: {
    yes: true
  }
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, username: action.username }
    default:
      return state;
  };
}

export default rootReducer;