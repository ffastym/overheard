/**
 * @author Yuriy Matviyuk
 */
const initialState = {
    id         : null,
    login      : null,
    likedPosts : {}
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LIKE_DISLIKE_POST':
            state = {
                ...state,
                likedPosts: action.payload
            };
            break;
        case 'LOGIN':
            state = {
                ...state,
                ...action.payload
            };
            break;
        case 'LOGOUT':
            state = {
                ...state,
                ...action.payload
            };
            break;
        default:
            state = {
                ...state
            };
    }

    return state;
};

export default userReducer
