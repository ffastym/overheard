/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import {connect} from "react-redux"
import popUpActions from "../../actions/popUpActions"
import {Redirect} from 'react-router-dom'
import Login from "./Login";
import Loader from "./Loader";

/**
 * PopUp component
 *
 * @param props
 *
 * @returns {*}
 * @constructor
 */
class PopUp extends Component {
    /**
     * PopUp Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            title         : '',
            isModal       : false,
            text          : '',
            customContent : null
        };
    }

    /**
     * Component was mounted in DOM
     */
    componentDidMount() {
        let state;

        switch (this.props.type) {
            case 'LOGIN' :
                state = {
                    title         : 'Авторизація',
                    customContent : <Login/>
                };
                break;
            case 'POST_PREPARE' :
                state = {
                    title         : 'Відправляємо пост',
                    customContent : <Loader text='Пост надсилається, будь ласка, зачекайте...'/>
                };
                break;
            case 'LOGOUT' :
                state = {
                    title: 'Вихід з аккаунта',
                    text: 'Ви успішно вийшли з аккаунта'
                };
                break;
            case 'POST_ADDING_ERROR' :
                state = {
                    title: 'Пост не створено',
                    text: 'При створенні поста сталася помилка. Будь ласка, спробуйте за кілька хвилин ще раз'
                };
                break;
            case 'POST_ADDED' :
                state = {
                    title : 'Пост створено',
                    text  : 'Ваш пост успішно створено та відправлено на перевірку, після якої, у ' +
                        'разі позитивного рішення, він з\'явиться у загальній стрічці'
                };
                break;
            case 'IMAGE_UPLOADING_ERROR' :
                state = {
                    title : 'Помилка завантаження',
                    text  : 'На жаль, не вдалося завантажити зображення. Спробуйте, будь ласка пізніще'
                };
                break;
            default:
                state = {};
        }

        this.setState(state)
    };

    /**
     * Render component
     *
     * @returns {*}
     */
    render()
    {
        return (
            <div className='pop-up-overlay'>
                <div className="pop-up">
                    <div className="pop-up-title-wrapper">
                        <span className="pop-up-title" children={this.state.title}/>
                        <span className="pop-up-close" onClick={this.props.hidePopUp}/>
                    </div>
                    {this.state.customContent
                        ? this.state.customContent
                        : <React.Fragment>
                            <div className="pop-up-text" children={this.state.text}/>
                            <div className="pop-up-actions">
                                {this.state.isModal
                                    ? <React.Fragment>
                                        <button className="button button-reject" onClick={this.props.hidePopUp}>ні</button>
                                        <button className="button button-accept" onClick={this.props.hidePopUp}>так</button>
                                    </React.Fragment>
                                    : <button className="button ok-button" onClick={this.props.hidePopUp}>ок</button>}
                            </div>
                        </React.Fragment>}
                </div>
            </div>
        )
    }
}

/**
 * Add redux states to props
 *
 * @param state
 * @returns object
 */
const mapStateToProps = (state) => {
    return {
        type: state.popup.type
    }
};

/**
 * Add redux actions to props
 *
 * @param dispatch
 *
 * @returns {{hidePopUp: hidePopUp}}
 */
const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Hide popup
         */
        hidePopUp: () => {
            dispatch(popUpActions.hidePopUp())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PopUp)
