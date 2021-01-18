import { auth } from "../../firebase/firebaseAdmin";
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
} from "../types";
import axios from "axios";

export const loginUser = (userData, history) => (dispatch) => {
  const { email, password } = userData;
  dispatch({ type: LOADING_UI });
  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      return auth.currentUser.getIdToken(true);
    })
    .then((idToken) => {
      const FBIdToken = `Bearer ${idToken}`;
      localStorage.setItem("FBIdToken", FBIdToken);
      axios.defaults.headers.common["Authorization"] = FBIdToken;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      )
        err.code = "invalid credentials";
      dispatch({
        type: SET_ERRORS,
        payload: err.code,
      });
    });
};

// ***********************************************************************
export const signupUser = (newUserData, history) => (dispatch) => {
  const { email, password, handle } = newUserData;
  dispatch({ type: LOADING_UI });
  axios
    .post("/user/auth/signup", {
      email,
      password,
      handle,
    })
    .then((user) => {
      dispatch({ type: CLEAR_ERRORS });
      history.push("/login");
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data.message,
      });
    });
};

// ***********************************************************************

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get("/user")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err,
      });
    });
};

// ***********************************************************************
export const logoutUser = () => (dispatch) => {
  auth
    .signOut()
    .then(() => {
      localStorage.removeItem("FBIdToken");
      delete axios.defaults.headers.common["Authorization"];
      dispatch({ type: SET_UNAUTHENTICATED });
    })
    .catch((err) => console.log(err));
};
// ***********************************************************************
export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user/image", formData)
    .then(() => dispatch(getUserData()))
    .catch((err) => console.log(err));
};

// ***********************************************************************
export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user", userDetails)
    .then(() => dispatch(getUserData()))
    .catch((err) => console.log(err));
};
