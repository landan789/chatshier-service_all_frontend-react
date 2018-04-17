import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import Switch from 'react-switch';

import './Integration.css';

class Integration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            google: false
        };
        this.turnOnGoogleAPI = this.turnOnGoogleAPI.bind(this);
    }

    componentDidMount() {
    }

    turnOnGoogleAPI() {
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
