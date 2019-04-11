/**
 * @author Yuriy Matviyuk
 */
const initialState = {
    isMobile               : true,
    isNavActive            : false,
    isAcceptCookies        : false,
    isNotificationsEnabled : true,
    theme                  : 'light'
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_MENU':
            state = {
                ...state,
                isNavActive: !state.isNavActive
            };
            break;
        case 'ACCEPT_COOKIES':
            state = {
                ...state,
                isAcceptCookies: true
            };
            break;
        case 'SET_THEME':
            state = {
                ...state,
                theme: action.payload
            };
            break;
        case 'SET_DEVICE_TYPE':
            state = {
                ...state,
                isMobile: action.payload
            };
            break;
        case 'CHANGE_NOTIFICATIONS':
            state = {
                ...state,
                isNotificationsEnabled: !state.isNotificationsEnabled
            };
            break;
        default:
            state = {
                ...state
            };
    }

    return state;
};

export default appReducer
