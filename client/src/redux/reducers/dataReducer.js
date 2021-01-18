import {
  SET_SCREAMS,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_DATA,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_SCREAM,
  SUBMIT_COMMENT,
} from "../types";

const initialState = {
  screams: [],
  scream: {
    comments: [],
  },
  loading: false,
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_SCREAMS:
      return {
        ...state,
        loading: false,
        screams: [...action.payload],
      };

    case SET_SCREAM:
      return {
        ...state,
        scream: {
          ...action.payload,
        },
      };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let newScream = action.payload;
      return {
        ...state,
        screams: state.screams.map((scream) =>
          scream.screamId === newScream.screamId
            ? { ...scream, likeCount: newScream.likeCount }
            : { ...scream }
        ),
      };
    case DELETE_SCREAM:
      const index = state.screams.findIndex(
        (scream) => scream.screamId === action.payload
      );
      console.log(index);
      return {
        ...state,
        screams: [
          ...state.screams.slice(0, index),
          ...state.screams.slice(index + 1),
        ],
      };

    case POST_SCREAM:
      return {
        ...state,
        screams: [action.payload, ...state.screams],
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        scream: {
          ...state.scream,
          comments: [action.payload, ...state.scream.comments],
        },
      };
    default:
      return {
        ...state,
      };
  }
}
