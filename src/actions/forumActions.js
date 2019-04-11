/**
 * @author Yuriy Matviyuk
 */
const forumActions = {
    /**
     * Set cities
     *
     * @param cities
     *
     * @returns {{payload: *, type: string}}
     */
    setCities: (cities) => {
        return {
            type: 'SET_CITIES',
            payload: cities
        }
    },

    /**
     * Set posts
     *
     * @param data
     *
     * @returns {{payload: *, type: string}}
     */
    setPosts: (data) => {
        return {
            type: 'SET_POSTS',
            payload: data
        }
    }
};

export default forumActions;
