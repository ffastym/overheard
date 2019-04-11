/**
 * @author Yuriy Matviyuk
 */
import app from './reducers/appReducer'
import logger from 'redux-logger'
import popup from './reducers/popUpReducer'
import forum from './reducers/forumReducer'
import thunk from 'redux-thunk'
import user from './reducers/userReducer'
import {createStore, combineReducers, applyMiddleware} from 'redux'

let middleware = [thunk];

if (process.env.NODE_ENV === 'development') {
    middleware = [...middleware, logger]
}

export default createStore(
    combineReducers({app, user, popup, forum}),
    {},
    applyMiddleware(...middleware)
);
