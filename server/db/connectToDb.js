/**
 * @author Yuriy Matviyuk
 */
import mongoose from "mongoose";

const dbRoute = "mongodb://ffastym:Tt239allo@ds127736.mlab.com:27736/heroku_1bgmg3d7";

mongoose.connect(dbRoute, { useNewUrlParser: true });

const connectToDb = () => {
    const db = mongoose.connection;

    db.once("open", () => console.log("connected to the database"));

    // checks if connection with the database is successful
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
};

export default connectToDb;
