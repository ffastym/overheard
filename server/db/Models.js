/**
 * @author Yuriy Matviyuk
 */
import Schemas from "./Schemas"
import mongoose from "mongoose";

const Models = {
    /**
     * Location Model
     */
    Location: mongoose.model('Location', Schemas.LocationSchema, 'location'),

    /**
     * Post Model
     */
    Post: mongoose.model('Post', Schemas.PostSchema, 'posts'),

    /**
     * New Post Model
     */
    NewPost: mongoose.model('NewPost', Schemas.PostSchema, 'new_posts'),

    /**
     * Forum model
     */
    Forum: mongoose.model('Forum', Schemas.ForumSchema, 'forum'),

    /**
     * User model
     */
    User: mongoose.model('User', Schemas.UserSchema, 'users')
};

export default Models
