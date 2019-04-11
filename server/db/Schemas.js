/**
 * @author Yuriy Matviyuk
 */
import {Schema} from "mongoose";

const Schemas = {
    /**
     * Location Schema
     */
    LocationSchema: new Schema(
        {
            key: String,
            name: String,
            img: String,
            universities: [
                {
                    key: String,
                    name: String,
                }
            ]
        }
    ),

    /**
     * Post Schema
     */
    PostSchema: new Schema(
        {
            location: String,
            postId: Number,
            author: String,
            authorId: String,
            isAllowComments: Boolean,
            title: String,
            text: String,
            image: String,
            date: String,
            likesQty: Number,
            viewsQty: Number,
            comments: [
                {
                    text: String,
                    author: String,
                    date: String
                }
            ]
        }
    ),

    /**
     * Forum Schema
     */
    ForumSchema: new Schema(
        {
            dataType: String,
            value: Number
        }
    ),

    /**
     * User Schema
     */
    UserSchema: new Schema(
        {
            nick: String,
            password: String,
            likedPosts: {}
        }
    )
};

export default Schemas;
