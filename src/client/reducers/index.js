import {combineReducers} from 'redux';

import newsFeedsReducer from './newsFeedsReducer';
import voteCountReducer from './voteCountReducer';

const rootReducer = combineReducers({
    news: newsFeedsReducer,
    vote_count: voteCountReducer
});

export default rootReducer;