/**
 * @author Yuriy Matviyuk
 */
import React, { Component, Suspense, lazy } from 'react';
import {Link, withRouter} from "react-router-dom";
import Loader from "../global/Loader";
import {connect} from "react-redux";

const LazyPostPreview = lazy(() => import('../forum/PostPreview'));

/**
 * Posts component
 */
class Posts extends Component {
    /**
     * Posts Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            posts: [],
            lastPostIndex: -1,
            hasMore: true,
            collageLinks: null
        };

        props.cities.forEach(city => {
            if (city.key === props.loc && city.universities.length) {
                this.state.collageLinks = city.universities.map(collage => {
                    return <Link key={collage.key}
                                 className="location-link"
                                 to={'/' + collage.key}>
                                {collage.name}
                            </Link>
                })
            }
        })
    }

    componentDidMount() {
        this.loadPosts();
    }

    scrollList = (e) => {
        const listWrapper = e.target;

        this.setState({
            displayToTop: listWrapper.scrollTop > 100
        });

        if (listWrapper.scrollHeight <= Math.ceil(listWrapper.scrollTop + listWrapper.clientHeight + 1) && this.state.hasMore) {
            this.loadPosts()
        }
    };

    loadPosts = () => {
        let posts = [...this.props.posts].reverse(),
            lastIndex = 0,
            list = [];

        if (posts.length) {
            let counter = 0;

            posts.forEach((post, index) => {
                const postId = post.postId;

                if (index <= this.state.lastPostIndex) {
                    return
                }

                if (counter <= 4) {
                    list.push(
                        <Suspense key={postId} fallback={<Loader text='Пост завантажується...'/>}>
                            <LazyPostPreview loc={this.props.loc} postData={post}/>
                        </Suspense>
                    );

                    counter++;
                    lastIndex = index;
                } else {
                    return false
                }
            });

            let lastPostIndex = lastIndex;

            this.setState({
                lastPostIndex,
                posts: [...this.state.posts, ...list],
                hasMore: lastPostIndex !== posts.length - 1
            })
        }
    };

    /**
     * Render Posts component
     */
    render() {
        const posts = this.state.posts;

        return (
            <div className='posts-list-wrapper'
                 onScroll={this.scrollList}
                 ref={node => this.listWrapperRef = node}>
                    {this.state.collageLinks
                        && <div className="universities-list">
                            <p className='title'>Підслухано в навчальних закладах:</p>
                            {this.state.collageLinks}
                        </div>}
                <div className='posts-list'>
                    {this.state.displayToTop
                    && <span className='posts-button to-top'
                             onClick={() => this.listWrapperRef.scrollTo(0,0)}>
                    </span>}
                    <Link className='posts-button post-add' to={'/' + this.props.loc + '/new_post'}/>
                    {posts}
                    {this.state.hasMore && <Loader/>}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        login  : state.user.login,
        cities : state.forum.cities
    }
};

export default withRouter(connect(mapStateToProps)(Posts))
