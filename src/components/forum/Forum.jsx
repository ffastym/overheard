/**
 * @author Yuriy Matviyuk
 */
import axios from "axios";
import React, {Component} from 'react'
import {Switch, Route, withRouter} from "react-router-dom";
import CreatePost from './CreatePost';
import Posts from "./Posts";
import Post from "./Post";
import {connect} from "react-redux";
import Loader from "../global/Loader";
import forumActions from "../../actions/forumActions";

/**
 * Forum component
 */
class Forum extends Component {
    /**
     * Forum Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);

        let location = props.loc,
            locationPath = '/' + location;

        this.state = {
            location,
            createPostPath: locationPath + '/new_post',
            newPostsListPath: '/new_posts_list',
            postViewPath: locationPath + '/:post_id',
            forumPath: locationPath
        };
    }

    componentDidMount() {
        const serverApiPath = process.env.NODE_ENV === 'production'
            ? window.location.origin
            : 'http://localhost:3001';

        if (!this.props.postsData[this.state.location]) {
            axios.get(
                serverApiPath + '/api/getPosts',
                {params: {location: this.state.location}}
            ).then(({data}) => this.props.setPosts({
                location: this.state.location, data
            })).catch((err) => {
                console.log('posts loading error. posts loader from cache ---> ', err);
                let cachedPosts = localStorage.getItem('posts');

                if (cachedPosts) {
                    this.props.setPosts({
                        location: this.state.location, data: JSON.parse(cachedPosts)
                    })
                }
            })
        }
    }

    /**
     * Render Forum component
     */
    render() {
        return (
            <div className='page-content forum'>
                <Switch>
                    <Route exact
                           path={this.state.createPostPath}
                           render ={() => (<CreatePost loc={this.state.location}/>)}/>
                    <Route path={this.state.postViewPath}
                           render ={() => (<Post loc={this.state.location} ssr={this.props.ssr}/>)}/>
                    <Route path={this.state.forumPath} render = {() => (
                        this.props.postsData[this.state.location]
                            ? <Posts posts={this.props.postsData[this.state.location]}
                                     loc={this.state.location}/>
                            : <div className='loader-wrapper'>
                                <Loader text='Пости завантажуються, будь ласка, зачекайте...'/>
                            </div>
                    )}
                    />
                </Switch>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        postsData : state.forum.postsData
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Set posts data
         *
         * @param data
         */
        setPosts: (data) => {
            dispatch(forumActions.setPosts(data))
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Forum))
