import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import Switch from 'react-switch';

import { CLIENT_ID, SCOPES } from '../../../config/google-app';

import './Integration.css';

class Integration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            google: false,
            googleAuth: null
        };
        this.turnOnGoogleAPI = this.turnOnGoogleAPI.bind(this);
        this.loadCalendarApi = this.loadCalendarApi.bind(this);
    }

    componentDidMount() {
        this.loadCalendarApi();
    }

    loadCalendarApi() {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        document.head.appendChild(script);

        script.onload = () => {
            return new Promise((resolve, reject) => {
                window.gapi.load('client:auth2', () => {
                    resolve();
                });
            }).then(() => {
                return window.gapi.client.init({
                    clientId: CLIENT_ID,
                    scope: SCOPES
                });
            }).then(() => {
                return window.gapi.auth2.getAuthInstance();
            }).then((auth) => {
                this.setState({
                    googleAuth: auth,
                    google: auth.isSignedIn.get()
                });
            });
        };
    }

    signIn() {
        if (!this.state.googleAuth) {
            return Promise.reject(new Error('no_google_auth_instance'));
        }

        let signInOpts = {
            prompt: 'select_account' // 每一次進行登入時都 popup 出選擇帳號的視窗
        };

        return this.state.googleAuth.signIn(signInOpts).then(function(currentUser) {
            if (!currentUser) {
                return;
            }
            return currentUser.getBasicProfile();
        });
    }

    signOut() {
        return this.state.googleAuth.signOut();
    }

    turnOnGoogleAPI() {
        if (this.state.google) {
            this.signOut().then(() => {
                this.setState({google: false});
            });
            return;
        }
        this.signIn().then(() => {
            this.setState({google: true});
        }).catch(() => {
            if (this.state.gooele) {
                this.setState({google: false});
            }
        });
    }

    render() {
        return (
            <Modal size="lg" isOpen={this.props.isOpen} toggle={this.props.close} className="user-modal-content">
                <ModalHeader toggle={this.props.close}></ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col title">
                            <div className="box-border">
                                <h2 className="box-title">系統整合</h2>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-2 content">
                            <div className="box-border">
                                <i className="fab fa-google fa-3x"></i>
                                <br/><br/>
                                <Switch onChange={this.turnOnGoogleAPI} checked={this.state.google} className="react-switch" id="normal-switch"/>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
};

Integration.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
};

export default Integration;
