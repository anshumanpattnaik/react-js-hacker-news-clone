import {FETCH_NEWS_FEED} from '../actions/constants';

const initialState = {
  news: '',
};

const newsFeedsReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_NEWS_FEED: {
        const newState = {
          ...state,
          news: action.payload,
        };
        return newState;
      }
      default:
        return state;
    }
  };
  
  export default newsFeedsReducer;