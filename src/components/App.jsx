/**
 * @author Yuriy Matviyuk
 */
import appActions from './../actions/appActions'
import Aside from './global/Aside'
import axios from "axios";
import CookiesBanner from './global/CookiesBanner'
import Footer from './global/Footer'
import Forum from "./forum/Forum";
import forumActions from "../actions/forumActions";
import Header from './global/Header'
import Home from './static_pages/Home'
import Nav from './global/Nav'
import NewPosts from "./forum/NewPosts";
import PopUp from './global/PopUp';
import popUpActions from './../actions/popUpActions'
import React, {Component} from 'react'
import userActions from './../actions/userActions'
import {connect} from 'react-redux'
import {Switch, Route, withRouter, Link} from 'react-router-dom'

/**
 * App component
 */
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mobileBreakpoint: 768,
            cities: []
        };
    }

    /**
     * ComponentDidMount
     */
    componentDidMount() {
        this.getCities();

        let credentials = localStorage.getItem('credentials');

        if (credentials) {
            this.props.login(JSON.parse(credentials))
        }

        if (localStorage.getItem('acceptCookies')) {
            this.props.acceptCookies()
        }

        this.detectDeviceType();
        this.setTheme();

        window.addEventListener('click', (e) => {
            if (!e.target.classList.contains('settings')) {
                let settingsBtn = document.querySelector('.settings');

                if (settingsBtn) {
                    settingsBtn.classList.remove('active')
                }
            }
        })
    }

    getCities = () => {
        const serverApiPath = process.env.NODE_ENV === 'production'
            ? window.location.origin
            : 'http://localhost:3001';

        axios.get(serverApiPath + "/api/getCities")
            .then(res => this.props.setCities(res.data));
    };

    /**
     * Check is need to change default theme
     */
    setTheme = () => {
        if (localStorage.getItem('theme') === 'dark') {
            this.props.setTheme('dark')
        }
    };

    /**
     * Detect device viewport width and subscribe to it changes
     */
    detectDeviceType = () => {
        this.props.setDeviceType(window.innerWidth < this.state.mobileBreakpoint);

        window.addEventListener("resize", () => {
            this.props.setDeviceType(window.innerWidth < this.state.mobileBreakpoint)
        }, null);
    };

    getForumRoute = (key, name) => {
        return <Route key={key}
                      path={"/" + key}
                      render={() => (<Forum loc={key} name={name} ssr={this.props.ssr}/>)}/>
    };

    /**
   * Render App component
   *
   * @returns {*}
   */
    render() {
        let wrapperClassName = this.props.theme === 'dark' ? 'page-wrapper dark' : 'page-wrapper',
            ssr = this.props.ssr,
            cities = [],
            collages = [],
            routes = [],
            links = [];

        if ((ssr && ssr.cities && cities.length) || this.props.cities) {
            cities = (ssr && ssr.cities) || this.props.cities;

            routes = cities.map((city) => {
                if (city.universities.length) {
                     collages = [...collages, ...city.universities]
                }

                return this.getForumRoute(city.key, city.name)
            });

            if (collages.length) {
                routes = [
                    ...routes,
                    collages.map(collage => {return this.getForumRoute(collage.key, collage.name)})
                ]
            }

            links = cities.map((city) => {
                return <Link key={city.key}
                             className="loc-link"
                             to={'/' + city.key}>
                            <span className='loc-image-wrapper'>
                                <img src={city.img} alt={city.name}/>
                            </span>
                            <span className='loc-name'>{city.name}</span>
                        </Link>
            })
        }

        return (
            <div className={wrapperClassName}>
                <Header/>
                <div className='page-main-wrapper'>
                    <Aside/>
                    <Nav/>
                    <main className={this.props.isNavActive ? 'nav-active' : ''}>
                        <Switch>
                            {routes}
                            <Route exact path="/" render={() => (<Home links={links}/>)}/>
                            <Route exact path='/new_posts_list' component={NewPosts}/>
                        </Switch>
                    </main>
                </div>
                <Footer/>
                {this.props.isPopUpShow && <PopUp/>}
                {!this.props.isAcceptCookies && <CookiesBanner/>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        theme           : state.app.theme,
        isAcceptCookies : state.app.isAcceptCookies,
        isMobile        : state.app.isMobile,
        cities          : state.forum.cities,
        isPopUpShow     : state.popup.isPopUpShow
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Accept Cookies
         */
        acceptCookies: () => {
            dispatch(appActions.acceptCookies())
        },

        /**
         * Change design theme
         *
         * @param theme
         */
        setTheme: (theme) => {
            dispatch(appActions.setTheme(theme))
        },

        /**
         * Set cities
         *
         * @param cities
         */
        setCities: (cities) => {
            dispatch(forumActions.setCities(cities))
        },

        /**
         * Show popup
         *
         * @param type
         */
        showPopUp: (type) => {
            dispatch(popUpActions.showPopUp(type))
        },

        /**
         * Set device type
         *
         * @param isMobile
         */
        setDeviceType: (isMobile) => {
            dispatch(appActions.setDeviceType(isMobile))
        },

        /**
         * Set user as logged in
         *
         * @param data
         */
        login: (data) => {
            dispatch(userActions.login(data))
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
