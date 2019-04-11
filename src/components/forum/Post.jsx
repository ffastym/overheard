/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import {NavLink, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import forumActions from "../../actions/forumActions";
import popUpActions from "../../actions/popUpActions";
import Loader from "../global/Loader";
import {Image, Transformation} from 'cloudinary-react';
import userActions from "../../actions/userActions";
import axios from "axios";

/**
 * Post component
 */
class Post extends Component {
    /**
     * Post Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            comment: null
        };
    }

    /**
     * Component was mounted in DOM
     */
    componentDidMount() {
        const postId = parseInt(this.props.match.params.post_id, 10),
              postsData = this.props.postsData[this.props.loc],
              serverApiPath = process.env.NODE_ENV === 'production'
                ? window.location.origin
                : 'http://localhost:3001';

        if (!this.props.ssr) {
            axios.post(serverApiPath + '/api/setPostViews', {postId})
                .then(() => {
                    postsData && postsData.forEach((post, index) => {
                        if (post.postId === postId) {
                            postsData[index].viewsQty += 1;
                            this.props.setPosts(postsData)
                        }
                    });
                })
        }
    }

    getTextareaRef = (node) => {
        this.textarea = node;
    };

    setTextareaFocus = () => {
        if (!this.props.login) {
            return this.props.showPopUp('LOGIN')
        }

        this.textarea.focus()
    };

    /**
     * Like post
     */
    likePost = () => {
        const serverApiPath = process.env.NODE_ENV === 'production'
            ? window.location.origin
            : 'http://localhost:3001';

        if (!this.props.login) {
            return this.props.showPopUp('LOGIN')
        }

        const postId = this.props.match.params.post_id;

        let prevLikedList = this.props.likedPosts,
            newLikedPostsList = {...prevLikedList},
            postsData = [...this.props.postsData[this.props.loc]],
            userId = this.props.userId,
            isLike,
            currentPostIndex = 0;

        postsData.forEach((post, index) => {
            if (post.id === postId) {
                currentPostIndex = index
            }
        });

        if (prevLikedList[postId]) {
            isLike = false;
            postsData[currentPostIndex].likesQty -= 1;
            delete newLikedPostsList[postId]
        } else {
            isLike = true;
            postsData[currentPostIndex].likesQty += 1;
            newLikedPostsList[postId] = true
        }

        axios.post(serverApiPath + '/api/likePost', {userId, isLike, postId})
            .then((likesQty) => {
                postsData && postsData.forEach((post, index) => {
                    if (post.postId === postId) {
                        postsData[index].likesQty = likesQty;
                        this.props.setPosts(postsData)
                    }
                });
            });

        this.props.likeDislikePost(newLikedPostsList);

        let userData = JSON.parse(localStorage.getItem('credentials'));

        if (userData) {
            userData.likedPosts[postId] = isLike;

            localStorage.setItem('credentials', JSON.stringify(userData))
        }
    };

    addComment = () => {
        let date = new Date(),
            dd = date.getDate(),
            mm = date.getMonth() + 1,
            yyyy = date.getFullYear(),
            postId = parseInt(this.props.match.params.post_id, 10);

        const serverApiPath = process.env.NODE_ENV === 'production'
            ? window.location.origin
            : 'http://localhost:3001';

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        let fullDate = dd + '.' + mm + '.' + yyyy;

        let comment = {
            text: this.state.comment,
            author: this.props.login,
            postId,
            date: fullDate
        };

        axios.post(serverApiPath + '/api/commentPost', comment)
            .then(() => {
                let postsData = [...this.props.postsData[this.props.loc]];

                postsData.forEach((post, index) => {
                    if (post.postId === postId) {
                        postsData[index].comments.push(comment)
                    }
                });

                this.props.setPosts(postsData)
            });

        this.textarea.value = ''
    };

    setCommentText = (e) => {
        this.setState({
            comment: e.target.value
        })
    };


    /**
     * Render Post component
     */
    render() {
        const postId = parseInt(this.props.match.params.post_id, 10),
              postsData = this.props.postsData[this.props.loc],
              location = '/' + this.props.loc;

        if (!postsData) {
            return (
                <div className='loader-wrapper'>
                    <Loader text='Пост завантажується, будь ласка, зачекайте...'/>
                </div>
            )
        }

        let postData = null,
            postIndex,
            prevPostId = null,
            nextPostId = null;

        postsData && postsData.forEach((post, index) => {
            if (post.postId === postId) {
                postData = post;
                postIndex = index;
            }
        });

        if (!postData) {
            return (
                <div className='post-not-found'>
                    <h5>Пост не знайдено</h5>
                    <p>Нажаль неможливо відобразити даний пост. Можливо його не існує або він був видалений</p>
                    <NavLink exact to={location}>Повернутися до стрічки</NavLink>
                </div>
            )
        }

        const commentsData = postData.comments,
              likeBtnClassName = this.props.likedPosts[postId]
                ? 'post-view-like liked' : 'post-view-like',
              commentsQty = commentsData && (commentsData.length || 0),
              comments = [];

        if (commentsQty) {
            commentsData.forEach((comment, id) => {
                comments.push(
                    <div className="post-comment" key={id}>
                        <div className="post-comment-text">{comment.text}</div>
                        <div className='post-comment-data'>
                            <span className="post-comment-author">{comment.author}</span>
                            <span className="post-comment-date">{comment.date}</span>
                        </div>
                    </div>
                )
            })
        }

        if (typeof(postIndex) === 'number') {
            prevPostId = postIndex !== 0 && postsData[postIndex - 1].postId;
            nextPostId = (postIndex !== postsData.length - 1) && postsData[postIndex + 1].postId;
        }

        return (
            <div className='post-view'>
                <div className="post-toolbar">
                    <NavLink exact className="post-nav-link back" to={location}/>
                    {nextPostId && <NavLink className='post-nav-link next' to={location + '/' + nextPostId}/>}
                    <span className={likeBtnClassName} onClick={this.likePost}/>
                    {postData.isAllowComments && <span className="post-view-comment" onClick={this.setTextareaFocus}/>}
                    {prevPostId && <NavLink className='post-nav-link prev' to={location + '/' + prevPostId}/>}
                </div>
                <div className='post'>
                    <h3 className='post-title'>{postData.title}</h3>
                    {postData.image
                        ? <div className="post-image-wrapper">
                            <Image cloudName='dfgkgr7ui' publicId={postData.image} alt=''>
                                <Transformation height="400" fetchFormat="auto" width="auto" crop="scale" />
                            </Image>
                        </div> : false}
                    <div className="post-text">{postData.text}</div>
                    <div className="post-additional">
                        <div className="post-publication-data">
                            <span className="post-author">{postData.author}</span>
                            <span className="post-date">{postData.date}</span>
                        </div>
                        <div className='post-popularity-data'>
                            <span className="post-views-qty">{postData.viewsQty}</span>
                            <span className="post-likes-qty">{postData.likesQty}</span>
                            <span className="post-comments-qty">{commentsQty}</span>
                        </div>
                    </div>
                </div>
                <div className="post-comments">
                    <span className="post-comments-title">{'Коментарі (' + commentsQty + ') :'}</span>
                    <div className="post-comments-wrapper">
                        {comments.length
                            ? comments
                            : postData.isAllowComments
                                && <p className='comments-message'>До даного поста ще немає коментарів</p>}
                    </div>
                </div>
                {this.props.login && postData.isAllowComments
                    && <div className="post-write-comment">
                        <span className="post-comments-title">Написати коментар</span>
                        <textarea ref={this.getTextareaRef} onChange={this.setCommentText}/>
                        <div className="actions buttons">
                            <button className='button ok-button'
                                    disabled={!this.state.comment}
                                    onClick={this.addComment}>
                                Відправити
                            </button>
                        </div>
                    </div>}
                {!postData.isAllowComments
                    && <p className='comments-message'>Автор заборонив коментування запису</p>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        postsData  : state.forum.postsData,
        likedPosts : state.user.likedPosts,
        login      : state.user.login,
        userId     : state.user.id
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Set all posts data
         *
         * @param posts
         */
        setPosts: (posts) => {
            dispatch(forumActions.setPosts(posts))
        },

        /**
         * Change liked posts list
         *
         * @param list
         */
        likeDislikePost: (list) => {
            dispatch(userActions.likeDislikePost(list))
        },

        /**
         * Show popUp
         *
         * @param type
         */
        showPopUp: (type) => {
            dispatch(popUpActions.showPopUp(type))
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Post))
