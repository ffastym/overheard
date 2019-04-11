/**
 * @author Yuriy Matviyuk
 */
import appActions from '../../actions/appActions'
import React from 'react'
import {connect} from 'react-redux'
import {Helmet} from "react-helmet"
import {NavLink} from 'react-router-dom'
import popUpActions from "../../actions/popUpActions";
import userActions from "../../actions/userActions";

/**
 * Header component
 * @param props
 * @returns {*}
 * @constructor
 */
const Header = (props) => {
    let burgerClassName = props.isNavActive
            ? 'action menu-burger active'
            : 'action menu-burger',
        chatSwitchClassName = props.unreadMessagesCount
            ? 'action chat-switch unread'
            : 'action chat-switch',
        themeSwitchClassName = props.theme === 'dark'
            ? 'action theme-switch dark'
            : 'action theme-switch',
        loginClassName = props.login
            ? 'action logout'
            : 'action login',
        notificationsSwitchClassName = props.isNotificationsEnabled
            ? 'action notifications-switch'
            : 'action notifications-switch active';

    const toggleSettings = (e) => {
        e.target.classList.toggle('active')
    };

    return (
        <header>
            <NavLink exact={true} to='/' className='logo'>
                <h1>Підслухано</h1>
            </NavLink>
            <div className='actions'>
                <span className='action settings' onClick={toggleSettings}>
                    <span className="settings-wrapper">
                        <span className={notificationsSwitchClassName}
                              onClick={props.changeNotifications}
                              title='on/off notifications'
                        />
                        <span className={themeSwitchClassName}
                              onClick={props.setTheme}
                              title='change theme'
                        />
                    </span>
                </span>
                <span className={loginClassName}
                      title={props.login ? 'вийти з аккаунта' : 'увійти в аккаунт'}
                      onClick={props.login ? props.logOut : props.logIn}
                />
                <span className={burgerClassName}
                      onClick={props.toggleMenu}
                      title='show menu'>
                </span>
            </div>
            <Helmet>
                <meta name="theme-color" content={props.theme === 'dark' ? '#2F2F2F' : '#FFFFFF'} />
            </Helmet>
        </header>
    )
};

const mapStateToProps = (state) => {
    return {
        isMobile               : state.app.isMobile,
        isNotificationsEnabled : state.app.isNotificationsEnabled,
        theme                  : state.app.theme,
        login                  : state.user.login
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Toggle menu
         */
        toggleMenu: () => {
            dispatch(appActions.toggleMenu())
        },

        /**
         * Set Chat Theme
         */
        setTheme: () => {
            dispatch(appActions.setTheme())
        },

        /**
         * LogOut
         */
        logOut: () => {
            dispatch(popUpActions.showPopUp('LOGOUT'));
            dispatch(userActions.logOut())
        },

        /**
         * Login
         */
        logIn: () => {
            dispatch(popUpActions.showPopUp('LOGIN'));
        },

        /**
         * On/off notifications
         */
        changeNotifications: () => {
            dispatch(appActions.changeNotifications())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)
