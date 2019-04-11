import cors from "cors";
import connectToDb from "./db/connectToDb";
import {Types} from 'mongoose';
import express from "express";
import Models from "./db/Models";
import path from "path"
import renderHome from "./middleware/renderHome";
import renderForum from "./middleware/renderForum";
import bodyParser from "body-parser"

const app = express();
const PORT = 3001;
const router = express.Router();

let cities;

connectToDb();
app.use(cors());
app.use(bodyParser.json());

router.get("/", renderHome);

app.use('/api', router);
app.use(express.static(path.resolve(__dirname, '..', 'build')));

Models.Location.find((err, res) => {
    if (err) {
        console.log('fetching cities error ---> ', err);
    }

    cities = res;

    cities.forEach((city => {
        router.get("/" + city.key, renderForum);

        if (city.universities.length) {
            city.universities.forEach(collage => {
                router.get("/" + collage.key, renderForum);
            })
        }
    }));

    app.use(router)
});

/**
 * Get cities and universities data
 */
router.get("/getCities", (req, res) => {
    return res.json(cities);
});

/**
 * Get all published posts by location
 */
router.get("/getPosts", (req, res) => {
    Models.Post.find({location: req.query.location}, (err, posts) => {
        if (err) {
            console.log('fetching posts error ---> ', err);

            return res.json({success: false})
        }

        return res.json(posts)
    })
});

/**
 * Get list of all new posts
 */
router.get("/getNewPosts", (req, res) => {
    Models.NewPost.find((err, posts) => {
        if (err) {
            console.log('New posts fetching error ---> ', err);

            return res.json({success: false})
        }

        return res.json(posts)
    })
});

/**
 * Add comment to the post
 */
router.post("/commentPost", (req, res) => {
    let comment = {...req.body},
        postId = comment.postId;

    delete comment.postId;

    Models.Post.findOneAndUpdate(
        {postId},
        {$push: {comments: comment}},
        ((err) => {
            if (err) {
                console.log('Add post comment error ---> ', err);

                return res.json({success: false})
            }

            Models.User.findOneAndUpdate(

            );

            return res.json({success: true})
        })
    )
});

/**
 * Like/dislike post
 */
router.post("/likePost", (req, res) => {
    const postData = req.body,
          postId = postData.postId;

    Models.Post.findOneAndUpdate(
        {postId},
        {$inc: {likesQty: postData.isLike ? 1 : -1}},
        ((err, post) => {
            if (err) {
                console.log('New posts fetching error ---> ', err);

                return res.json({success: false})
            }

            let likedPosts = {},
                likedPost = 'likedPosts.' + postId;

            likedPosts[likedPost] = postData.isLike;

            Models.User.findOneAndUpdate(
                {_id: Types.ObjectId(postData.userId)},
                likedPosts,
                ((err) => {
                    if (err) {
                        console.log('New posts fetching error ---> ', err);
                    }
                })
            );

            return res.json(post.likesQty + 1)
        })
    )
});

/**
 * User log in and create account handler
 */
router.post("/login", (req, res) => {
    let user = req.body,
        nick = user.nick,
        password = user.password;

    if (user.isNew) {
        Models.User.findOne({nick}, (err, userDoc) => {
            if (err) {
                console.log('Change post views updating error ---> ', err);

                return res.json({create: false})
            }

            if (!userDoc) {
                let User = new Models.User;

                User.nick = nick;
                User.password = password;
                User.save();

                return res.json({nick, password, likedPosts: {}})
            } else {
                return res.json({nickExist: true})
            }
        });
    } else {
        Models.User.findOne({nick, password}, (err, user) => {
            if (err) {
                console.log('Change post views updating error ---> ', err);

                return res.json({success: false})
            }

            return res.json(user)
        });
    }
});

/**
 * Update post views qty
 */
router.post("/setPostViews", (req, res) => {
    const postId = req.body.postId;

    Models.Post.findOneAndUpdate({postId}, {$inc: {viewsQty: 1}}, (err) => {
        if (err) {
            console.log('Change post views updating error ---> ', err);

            return res.json({success: false})
        }

        return res.json({success: true});
    })
});

/**
 * Publish or delete post
 */
router.post("/managePost", (req, res) => {
    let body = req.body,
        publish = body.publish,
        post = body.post,
        Post = new Models.Post;

    for (let key in post) {
        if (!post.hasOwnProperty(key)) {
            return res.json({ success: false})
        }

        Post[key] = post[key]
    }

    if (publish) {
        Post.save(err => {
            if (err) {
                console.log('saving post error ---> ', err);

                return res.json({success: false})
            }
        });
    }

    Models.NewPost.deleteOne({postId: post.postId}, (err) => {
        if (err) {
            console.log('deleting post error ---> ', err);

            return res.json({success: false})
        }

        return res.json({success: true});
    })
});

/**
 * Add new post to the temporary collection
 */
router.post("/addPost", (req, res) => {
    let post = req.body,
        NewPost = new Models.NewPost;

    for (let key in post) {
        if (!post.hasOwnProperty(key)) {
            return res.json({ success: false})
        }

        NewPost[key] = post[key]
    }

    Models.Forum.findOneAndUpdate(
        {dataType: "lastPostId"},
        {$inc: {value: 1}},
        (err, {_doc}) => {
            if (err) {
                console.log('fetching last post id error ---> ', err);

                return res.json({success: false})
            }

            NewPost.postId = _doc.value;
            NewPost.save(err => {
                if (err) {
                    console.log('saving post error ---> ', err);

                    return res.json({success: false})
                }

                return res.json({success: true});
            });
        }
    );
});

app.listen(process.env.PORT || PORT, () => console.log(`LISTENING ON PORT ${PORT}`));
