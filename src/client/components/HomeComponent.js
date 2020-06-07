import React from 'react';
import "../css/index.css";

import { connect } from 'react-redux';
import FlatList from 'flatlist-react';

import { fetchNewsFeed, setUpVoteCount, hideNewsFeed } from '../actions';
import { NEWS_STORAGE_KEY, NEWS_FEED_SHOW, UP_ARROW_ICON } from '../actions/constants';

import { LineChart } from 'react-chartkick';
import 'chart.js'

class HomeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newsFeeds: [],
            startPage: 1,
            endPage: 31
        }
    }

    componentDidMount() {
        this.props.fetchNewsFeed(this.state.startPage, this.state.endPage);
    }

    getDomain(url) {
        if (url != undefined) {
            var domain = url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
            return domain;
        }
    }

    setUpVoteCount = (item) => {
        var id = item.id;
        var title = item.title;
        var author = item.author;
        var posted_time = item.posted_time;
        var url = item.url;
        var comments = item.comments;

        var storage_item = localStorage.getItem(NEWS_STORAGE_KEY + id);
        var parse_storage_item = JSON.parse(storage_item);

        var parse_storage_title = parse_storage_item.title;
        var parse_storage_vote_count = parse_storage_item.vote_count;

        if (title == parse_storage_title) {
            var new_vote_count = parseInt(parse_storage_vote_count) + 1;
            var news_results = {
                "id": id,
                "title": title,
                "author": author,
                "time": posted_time,
                "url": url,
                "vote_count": new_vote_count,
                "comments": comments,
                "hide": NEWS_FEED_SHOW
            }
            localStorage.setItem(NEWS_STORAGE_KEY + id, JSON.stringify(news_results));
            this.props.setUpVoteCount(news_results)
        }
    }

    renderVoteCount = (item) => {
        var id = item.id;
        var votes;
        var vote = JSON.parse(JSON.stringify(this.props.vote_count)).vote_count;

        if (id == vote.id) {
            votes = vote.vote_count;
        } else {
            var storage_item = localStorage.getItem(NEWS_STORAGE_KEY + id);
            var parse_storage_item = JSON.parse(storage_item);
            var vote_count = parse_storage_item != null ? parse_storage_item.vote_count : 0;
            votes = vote_count;
        }
        return (
            <span className={'vote-span'}>{votes}</span>
        );
    }

    hideNewsFeed = (item) => {
        this.props.hideNewsFeed(this.props.news, item.id);
    }

    renderItem = (item, index) => {
        return (
            <div>
                <table width="100%" height="30" border="0" bgcolor={index % 2 == 0 ? '#FFFFFF' : '#F2F2F2'} className={'desktop-table'}>
                    <tr>
                        <td valign="middle" align="center" className={'td-header-cloumn-width'}><span className={'comments-span'}>{item.comments}</span></td>
                        <td valign="middle" align="center" className={'td-cloumn-width'}>{this.renderVoteCount(item)}</td>
                        <td valign="middle" align="center" className={'td-cloumn-width'}>
                            <a href="#" onClick={this.setUpVoteCount.bind(this, item)}><img src={UP_ARROW_ICON} className={'up-arrow-icon'} /></a>
                        </td>
                        <td valign="middle">
                            <span className={'news-details-span'}>{item.title}</span>
                            <a href={item.url} className={'news-url-span'} target="_blank">({this.getDomain(item.url)})</a>
                            <span className={'news-url-span'}>by</span>
                            <span className={'news-author-span'}>{item.author}</span>
                            <span className={'news-time-span'}>{item.time}</span>
                            <span className={'news-left-bracket'}>[</span>
                            <a href="#" className={'news-hide-label'} onClick={this.hideNewsFeed.bind(this, item)}>hide</a>
                            <span className={'news-right-bracket'}>]</span>
                        </td>
                    </tr>
                </table>
                <table width="100%" border="0" bgcolor={index % 2 == 0 ? '#FFFFFF' : '#F2F2F2'} className={'mobile-table'}>
                    <tr>
                        <td valign="middle" align="center" className={'td-mobile-cloumn-width'}>{this.renderVoteCount(item)}</td>
                        <td valign="middle" align="center" className={'td-mobile-cloumn-width'}>
                            <a href="#" onClick={this.setUpVoteCount.bind(this, item)}><img src={UP_ARROW_ICON} className={'mobile-up-arrow-icon'} /></a>
                        </td>
                        <td valign="middle">
                            <span className={'mobile-news-details-span'}>{item.title}</span>
                            <a href={item.url} className={'mobile-news-url-span'} target="_blank">({this.getDomain(item.url)})</a>
                            <div className={'mobile-news-footer-container'}>
                                <span className={'mobile-news-by-span'}>by</span>
                                <span className={'mobile-news-author-span'}>{item.author}</span>
                                <span className={'mobile-news-time-span'}>{item.time}</span>
                                <span className={'mobile-news-left-bracket'}>[</span>
                                <a href="#" className={'mobile-news-hide-label'} onClick={this.hideNewsFeed.bind(this, item)}>hide</a>
                                <span className={'mobile-news-right-bracket'}>]</span>
                                <span className={'mobile-news-comments'}>{item.comments} comments</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        )
    }

    renderLineChart = results => {
        var statistics = [];

        for (var i = 0; i < results.length; i++) {
            var id = results[i].id.toString();

            var storage_item = localStorage.getItem(NEWS_STORAGE_KEY + id);
            var parse_storage_item = JSON.parse(storage_item);
            var vote_count = parse_storage_item != null ? parse_storage_item.vote_count : 0;

            var votes = vote_count;

            var item = { [id]: votes }
            statistics.push(item);
        }
        var graph_item = JSON.stringify(statistics);
        graph_item = graph_item.replace(/[{}]/g, "");
        graph_item = graph_item.replace('[', '{');
        graph_item = graph_item.replace(']', '}');

        var data = JSON.parse(graph_item);

        return (
            <LineChart
                data={data}
            />
        )
    }

    previousPage() {
        var endPage = this.state.endPage > 61 ? this.state.endPage - 30 : 31;
        var startPage = this.state.startPage > 31 ? this.state.startPage - 30 : 1;

        this.setState({
            endPage: endPage,
            startPage: startPage
        })
        this.props.fetchNewsFeed(startPage, endPage);
    }

    nextPage() {
        var endPage = this.state.endPage + 30;
        var startPage = this.state.startPage + 30;

        this.setState({
            endPage: endPage,
            startPage: startPage
        })
        this.props.fetchNewsFeed(startPage, endPage);
    }

    render() {
        var results = JSON.parse(JSON.stringify(this.props.news)).news;
        return (
            <div className={'parent-div-container'}>
                <div></div>
                <div className={'news-feed-container'}>
                    <div className={'news-feed-header'}>
                        <table cellPadding="0" cellSpacing="0" width="100%" border="0" className={'desktop-table'}>
                            <tr>
                                <td valign="middle" align="center" className={'td-header-cloumn-width'}><span className={'header-label'}>Comments</span></td>
                                <td valign="middle" align="center" className={'td-header-cloumn-width'}><span className={'header-label'}>Vote Count</span></td>
                                <td valign="middle" align="center" className={'td-header-cloumn-width'}><span className={'header-label'}>UpVote</span></td>
                                <td valign="middle"><span className={'header-label'}>News Details</span></td>
                            </tr>
                        </table>
                        <table cellPadding="0" cellSpacing="0" width="100%" border="0" className={'mobile-table'}>
                            <tr>
                                <td valign="middle" align="center" className={'td-mobile-header-cloumn-width'}><span className={'mobile-header-label'}>Vote Count</span></td>
                                <td valign="middle" align="center" className={'td-mobile-header-cloumn-width'}><span className={'mobile-header-label'}>UpVote</span></td>
                                <td valign="middle"><span className={'mobile-header-label'}>News Details</span></td>
                            </tr>
                        </table>
                    </div>
                    <div>
                        {results.length > 0 ?
                            <FlatList
                                list={results}
                                renderItem={this.renderItem}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            />
                            : null}
                    </div>
                    <div className={'pagination-container'}>
                        <div></div>
                        <div className={'pagination-btn-container'}>
                            <a href="#" className={'prev-btn-label'} onClick={this.previousPage.bind(this)}>Previous</a>
                            <div className={'btn-separator-div'}></div>
                            <a href="#" className={'next-btn-label'} onClick={this.nextPage.bind(this)}>Next</a>
                        </div>
                    </div>
                    <div className={'news-feed-bottom-div'}></div>
                    <div className={'news-feed-line-chart-container'}>
                        <div>
                            <p className={'line-chart-votes-label'}>Votes</p>
                        </div>
                        {this.renderLineChart(results)}
                    </div>
                    <div className={'line-chart-id-div'}>
                        <p className={'line-chart-id-label'}>ID</p>
                    </div>
                    <div className={'news-feed-bottom-div'}></div>
                </div>
                <div></div>
            </div>
        );
    }
}

const stateProps = state => ({
    news: state.news,
    vote_count: state.vote_count
});

const dispatchProps = dispatch => ({
    fetchNewsFeed: (start, end) => dispatch(fetchNewsFeed(start, end)),
    setUpVoteCount: item => dispatch(setUpVoteCount(item)),
    hideNewsFeed: (feeds, id) => dispatch(hideNewsFeed(feeds, id))
});

export default connect(stateProps, dispatchProps)(HomeComponent);