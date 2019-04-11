/**
 * @author Yuriy Matviyuk
 */
const appActions = {
    /**
     * Toggle menu
     *
     * @returns {{type: string}}
     */
    toggleMenu: () => {
        return {
            type: 'TOGGLE_MENU'
        }
    },

    /**
     * Accept Cookies
     *
     * @returns {{type: string}}
     */
    acceptCookies: () => {
        localStorage.setItem('acceptCookies', 'true');

        return {
            type: 'ACCEPT_COOKIES'
        }
    },

    /**
     * Set chat theme
     *
     * @param theme = null
     *
     * @returns {{type: string}}
     */
    setTheme: (theme = null) => {
        if (!theme) {
            theme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark'
        }

        localStorage.setItem('theme', theme);

        return {
            type    : 'SET_THEME',
            payload : theme
        }
    },

    /**
     * On/off notifications
     *
     * @returns {{type: string}}
     */
    changeNotifications: () => {
        return {
            type: 'CHANGE_NOTIFICATIONS'
        }
    },

    /**
     * Set device type
     *
     * @param isMobile
     *
     * @returns {{payload: *, type: string}}
     */
    setDeviceType: (isMobile) => {
        return {
            type    : 'SET_DEVICE_TYPE',
            payload : isMobile
        }
    }
};

export default appActions;
