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
  console.log(auth.currentUser);
  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log("getiing  token");
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
      console.log(err);
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
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.code,
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
        payload: err.code,
      });
    });
};

// ***********************************************************************
export const logoutUser = () => (dispatch) => {
  auth
    .signOut()
    .then(() => {
      console.log("singout user");
      localStorage.removeItem("FBIdToken");
      delete axios.defaults.headers.common["Authorization"];
      dispatch({ type: SET_UNAUTHENTICATED });
    })
    .catch((err) => console.log(err));
};

// ***********************************************************************
// export const getPersistedUser = () => (dispatch) => {
//   const token = localStorage.FBIdToken;
//   if (token) {
//     const decodedToken = jwtDecode(token);
//     if (decodedToken.exp * 1000 > Date.now())
//       dispatch({ type: SET_AUTHENTICATED });
//   }
// };

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
