/**
 * @author Yuriy Matviyuk
 */
const userActions = {
    /**
     * Set user as logged in
     *
     * @param data
     *
     * @returns {{payload: *, type: string}}
     */
    login(data) {
        let id = data._id,
            login = data.nick,
            userData = {...data, id, login};

        delete userData.password;
        delete userData._id;

        localStorage.setItem('unique_id', id);

        return {
            type: 'LOGIN',
            payload: userData
        }
    },

    /**
     * Logout
     *
     * @returns {{type: string}}
     */
    logOut: () => {
        let userData = {
                nick: null,
                login: null
            };

        localStorage.removeItem('credentials');
        localStorage.removeItem('nick');

        return {
            type: "LOGOUT",
            payload: userData
        }
    },
    /**
     * Change liked posts list
     *
     * @param list
     *
     * @returns {{payload: *, type: string}}
     */
    likeDislikePost: (list) => {
        return {
            type    : "LIKE_DISLIKE_POST",
            payload : list
        }
    }
};

export default userActions;
