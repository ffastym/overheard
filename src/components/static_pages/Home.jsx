/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import Loader from '../global/Loader'
import userActions from '../../actions/userActions'
import {connect} from 'react-redux'

/**
 * Home component
 *
 * @param props
 *
 * @returns {*}
 * @constructor
 */
const Home = ({links}) => {
    return (
        <div className='page-content home'>
            <div className="logo-wrapper">
                <img src="https://res.cloudinary.com/dfgkgr7ui/image/upload/v1554918614/pidsluhano.png" alt="Підслухано"/>
                <h1>Підслухано - цікаві історії, захоплюючі зізнання</h1>
            </div>
            <div className="loc-wrapper">
                {links.length ? links : <Loader/>}
            </div>
        </div>
    )
};

export default Home
