import {SET_UPVOTE_COUNT} from '../actions/constants';

const initialState = {
  vote_count: '',
};

const voteCountReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_UPVOTE_COUNT: {
        const newState = {
          ...state,
          vote_count: action.payload,
        };
        return newState;
      }
      default:
        return state;
    }
  };
  
  export default voteCountReducer;