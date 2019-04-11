/**
 * @author Yuriy Matviyuk
 */
import renderer from "./renderer"
import Models from "../db/Models"

const renderHome = (req, res) => {
    Models.Location.find((err, cities) => {
        if (err) return console.log('fetching cities err ---> ', err);

        return renderer(req.url, res, {cities})
    });
};

export default renderHome
