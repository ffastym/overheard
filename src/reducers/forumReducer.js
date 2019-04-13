/**
 * @author Yuriy Matviyuk
 */
const initialState = {
    cities: null,
    activeLocation: null,
    postsData: {}
};

const forumReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CITIES':
            state = {
                ...state,
                cities: action.payload
            };
            break;
        case 'SET_ACTIVE_LOCATION':
            state = {
                ...state,
                activeLocation: action.payload
            };
            break;
        case 'SET_POSTS':
            let postsData = {...state.postsData};

            postsData[action.payload.location] = action.payload.data;

            state = {...state, postsData};
            localStorage.setItem('posts', JSON.stringify(postsData));
            break;
        default:
            state = {...state};
    }

    return state;
};

export default forumReducer
