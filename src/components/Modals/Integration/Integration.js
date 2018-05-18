import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Switch from 'react-switch';

import gCalendarHelper from '../../../helpers/googleCalendar';

import googleCalendarPng from '../../../image/google-calendar.png';
import './Integration.css';

class Integration extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        close: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            googleSignedIn: gCalendarHelper.isSignedIn
        };
        this.turnOnGoogleAPI = this.turnOnGoogleAPI.bind(this);
    }

    turnOnGoogleAPI(isChecked) {
        if (!isChecked) {
            return gCalendarHelper.signOut().then(() => {
                this.setState({ googleSignedIn: gCalendarHelper.isSignedIn });
            });
        }

        return gCalendarHelper.signIn().then(() => {
            this.setState({ googleSignedIn: gCalendarHelper.isSignedIn });
        }).catch(() => {
            this.setState({ googleSignedIn: false });
        });
    }

    render() {
        return (
            <Modal className="user-modal" size="lg" isOpen={this.props.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}></ModalHeader>
                <ModalBody>
                    <Row>
                        <Col className="col title">
                            <div className="box-border">
                                <h2 className="box-title">系統整合</h2>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="2" className="content">
                            <div className="box-border">
                                <div>
                                    <img className="google-calendar" src={googleCalendarPng} alt="" />
                                </div>
                                <p className="title">Google Calendar</p>
                                <div>
                                    <Switch className="react-switch" onChange={this.turnOnGoogleAPI} checked={this.state.googleSignedIn} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        );
    }
}

export default Integration;
