import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';

import browser from '../../helpers/browser';

import './Signup.css';

class Signup extends React.Component {
    componentWillMount() {
        browser.setTitle('註冊');
    }

    render() {
        return (
            <Fade in className="signup-container">
                <div className="chsr col-md-12 text-center signup-logo">
                    <div>
                        <img alt="Chatshier-logo" src="image/png/logo.png" />
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="row justify-content-center">
                        <div className="form-content col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3">
                            <h2 className="text-center signup-title">開始體驗您的Chatshier</h2>
                            <p className="text-center lead">不需付費。馬上體驗聊天功能。</p>
                            <div className="form-container">
                                <form className="form-horizontal">
                                    <fieldset>
                                        <div className="form-group">
                                            <div className="input-group padding-left-right">
                                                <div className="chsr input-group-prepend">
                                                    <span className="input-group-text w-100 justify-content-center">
                                                        <i className="fa fa-user"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control" placeholder="姓名" data-toggle="tooltip" data-placement="top" required/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group padding-left-right">
                                                <div className="chsr input-group-prepend">
                                                    <span className="input-group-text w-100 justify-content-center">
                                                        <i className="fa fa-envelope"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control" placeholder="電子郵件" required/>
                                            </div>
                                        </div>
                                        <div className="form-group padding-left-right">
                                            <div className="input-group">
                                                <div className="chsr input-group-prepend">
                                                    <span className="input-group-text w-100 justify-content-center">
                                                        <i className="fa fa-lock"></i>
                                                    </span>
                                                </div>
                                                <input type="password" className="form-control" placeholder="密碼" required/>
                                            </div>
                                        </div>
                                        <div className="form-group padding-left-right">
                                            <div className="input-group">
                                                <div className="chsr input-group-prepend">
                                                    <span className="input-group-text w-100 justify-content-center">
                                                        <i className="fa fa-lock"></i>
                                                    </span>
                                                </div>
                                                <input type="password" className="form-control" placeholder="確認密碼" required/>
                                            </div>
                                        </div>
                                        <div className="error-notify"></div>
                                        <div className="form-group padding-left-right">
                                            <div className="controls">
                                                <button className="btn btn-info">註冊</button>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div className="text-center signup-option">
                                        <p>
                                            我同意 Chatshier
                                            <a className="link-text" href="https://www.chatshier.com/terms.html" target="_blank" rel="noopener noreferrer">服務條款</a>
                                                &amp;
                                            <a className="link-text" href="https://www.chatshier.com/privacy.html" target="_blank" rel="noopener noreferrer">隱私權條款</a>
                                        </p>
                                        <p>
                                            <Route render={(router) => (
                                                <p>
                                                    已經有帳號了嗎？請按
                                                    <span className="link-text" onClick={() => {
                                                        router.history.push('/signin');
                                                    }}>這裡</span>
                                                    登入。
                                                </p>
                                            )}></Route>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Fade>
        );
    }
}

export default withRouter(Signup);
