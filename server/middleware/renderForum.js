/**
 * @author Yuriy Matviyuk
 */
import renderer from "./renderer"

const renderForum = (req, res) => {
    return renderer(req.url, res)
};

export default renderForum
