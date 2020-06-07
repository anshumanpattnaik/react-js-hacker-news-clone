import {
    BASE_URL,
    ITMES,
    FETCH_NEWS_FEED,
    SET_UPVOTE_COUNT,
    NEWS_STORAGE_KEY,
    NEWS_FEED_SHOW,
    NEWS_FEED_HIDE
} from './constants';

import 'regenerator-runtime/runtime';

export const dispatchNewsFeeds = data => ({
    type: FETCH_NEWS_FEED,
    payload: data
});

export const fetchNewsFeed = (start, end) => async (dispatch) => {

    console.log("fetchNewsFeed...." + start+" == "+end);

    var feeds = [];
    for (var i = start; i < end; i++) {
        await fetch(BASE_URL + ITMES + parseInt(i))
            .then(response => response.json())
            .then(data => {
                var results = JSON.parse(JSON.stringify(data));

                var title = results.title;
                if (title != null) {
                    var id = results.id;
                    var author = results.author;
                    var url = results.url;
                    var timeStamp = results.created_at_i;
                    var vote_count = results.points;
                    var commentCount = results.children.length;

                    var date = new Date(timeStamp * 1000);
                    var posted_time = date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear();

                    var storage_item = localStorage.getItem(NEWS_STORAGE_KEY + id);
                    var parse_storage_item = JSON.parse(storage_item);

                    var vote_storage_count = parse_storage_item != null ? parse_storage_item.vote_count : 0;                    
                    var show_hide_status = (parse_storage_item !=null && parse_storage_item.hide && parse_storage_item.hide === NEWS_FEED_HIDE)? NEWS_FEED_HIDE: NEWS_FEED_SHOW
                    
                    if(show_hide_status === NEWS_FEED_SHOW){
                        var news_results = {
                            "id": id,
                            "title": title,
                            "author": author,
                            "time": posted_time,
                            "url": url,
                            "vote_count": vote_storage_count > vote_count ? vote_storage_count : vote_count,
                            "comments": commentCount,
                            "hide": show_hide_status
                        }
                        feeds.push(news_results)
                        localStorage.setItem(NEWS_STORAGE_KEY + id, JSON.stringify(news_results));
                        dispatch(dispatchNewsFeeds(feeds));
                    }

                }
            }).catch(error => {
                console.log("Error Feed -- " + i + " == " + JSON.stringify(error));
            })
    }
}

export const dispatchVoteCount = count => ({
    type: SET_UPVOTE_COUNT,
    payload: count
});

export const setUpVoteCount = vote => dispatch => {

    console.log("Vote : setUpVoteCount Redux = " + JSON.stringify(vote));
    dispatch(dispatchVoteCount(vote));
}

export const hideNewsFeed = (feeds, id) => dispatch => {
    if(feeds != null) {
        var parseHide = JSON.parse(JSON.stringify(feeds))
        if(parseHide !== undefined){
            var news = parseHide.news
            let index = news.findIndex(el => el.id === id);
            var item = news[index];
            news.splice(index, 1);

            var hide_results = {
                "id": item.id,
                "title": item.title,
                "author": item.author,
                "time": item.posted_time,
                "url": item.url,
                "vote_count": item.vote_count,
                "comments": item.comments,
                "hide": NEWS_FEED_HIDE
            }
            localStorage.setItem(NEWS_STORAGE_KEY + id, hide_results)
            dispatch(dispatchNewsFeeds(news));
        }
    }
}