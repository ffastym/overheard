/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import {Image, Transformation} from "cloudinary-react";
import axios from "axios";

/**
 * NewPosts component
 */
class NewPosts extends Component {
    /**
     * NewPosts Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            newPosts: null
        };
    }

    componentDidMount() {
        const serverApiPath = process.env.NODE_ENV === 'production'
            ? window.location.origin
            : 'http://localhost:3001';

        axios.get(serverApiPath + '/api/getNewPosts')
            .then(({data}) => {
                let newPosts = {};

                data.forEach((post) => {
                    newPosts[post._id] = post
                });

                this.setState({newPosts})
            }).catch((err) => console.log('New posts loading error ---> ', err))
    }

    /**
     * Add or delete post
     *
     * @param e
     * @param publish
     */
    managePost = (e, publish = true) => {
        let newPosts = {...this.state.newPosts},
            postId = e.target.dataset.postId,
            post = newPosts[postId],
            newPost = {post: {...post}, publish},
            serverApiPath = process.env.NODE_ENV === 'production'
                ? window.location.origin
                : 'http://localhost:3001';

        axios.post(serverApiPath + "/api/managePost", newPost);

        delete newPosts[postId];

        this.setState({newPosts});
    };

    /**
     * Render NewPosts component
     */
    render() {
        let posts = this.state.newPosts,
            list = [];

        if (!posts) {
            return 'Нових постів немає'
        }

        for (let id in posts) {
            if (!posts.hasOwnProperty(id)) {
                continue
            }

            let post = posts[id];

            list.push(
                <div className='new-post' key={id}>
                    <h4>{post.title}</h4>
                    <Image cloudName='dfgkgr7ui' publicId={post.image} alt=''>
                        <Transformation height="200" fetchFormat="auto" width="auto" crop="scale" />
                    </Image>
                    <p>{post.text}</p>
                    <div className='new-post-actions'>
                        <button type='button'
                                onClick={(e) => this.managePost(e,false)}
                                data-post-id={post._id}
                                className='button button-reject'>Delete</button>
                        <button type='button'
                                onClick={(e) => this.managePost(e)}
                                data-post-id={post._id}
                                className='button button-accept'>Add</button>
                    </div>
                </div>
            )
        }

        return (
            <div className='new-posts-list'>
                {list}
            </div>
        )
    }
}

export default NewPosts
