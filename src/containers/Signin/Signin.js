import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import './Signin.css';

class Signin extends Component {
    render() {
        return (
            <div className="signin-container">
                <div className="chsr col-md-12 text-center signin-logo">
                    <a id="index" href="index.html">
                        <img alt="Chatshier-logo" src="image/png/logo.png" />
                    </a>
                </div>

                <div className="col-md-12 column wh-reg-step-login">
                    <div className="row justify-content-center">
                        <div className="col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3 form-content">
                            <h2 className="text-center login-title">登入您的帳號</h2>
                            <div className="form-container">
                                <form className="form-horizontal">
                                    <fieldset>
                                        <div className="form-group padding-left-right">
                                            <div className="input-group ">
                                                <div className="chsr input-group-prepend">
                                                    <span className="input-group-text w-100 justify-content-center">
                                                        <i className="fa fa-envelope"></i>
                                                    </span>
                                                </div>
                                                <input id="login-email" type="text" className="form-control" placeholder="電子郵件" required data-toggle="tooltip" data-placement="top" title="找不到使用者" />
                                            </div>
                                        </div>
                                        <div className="form-group padding-left-right">
                                            <div className="input-group">
                                                <div className="chsr input-group-prepend">
                                                    <span className="input-group-text w-100 justify-content-center">
                                                        <i className="fa fa-lock"></i>
                                                    </span>
                                                </div>
                                                <input id="login-password" type="password" className="form-control" placeholder="密碼" required data-toggle="tooltip" data-placement="top" title="密碼錯誤!" />
                                            </div>
                                        </div>
                                        <div className="form-group padding-left-right">
                                            <label className="control-label"></label>
                                            <div className="controls">
                                                <button id="login-btn" className="btn btn-info" data-loading-text="<i className='fa fa-circle-o-notch fa-spin'></i> 登入中...">登入</button>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div className="text-center forget-password">
                                        <p>忘記密碼？請按<a href="#">這裡</a>重設密碼。</p>
                                        <p>還沒有帳號嗎請按<a href="/signup">這裡</a>註冊。</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signin;
