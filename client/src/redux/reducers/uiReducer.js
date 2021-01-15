import { SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from "../types";

const initialState = {
  loading: false,
  uiError: "",
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        uiError: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        uiError: "",
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true,
        uiError: "",
      };
    default:
      return {
        ...state,
      };
  }
}
