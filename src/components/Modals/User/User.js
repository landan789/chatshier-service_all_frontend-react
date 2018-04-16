import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

import authHelper from '../../../helpers/authentication';
import apiDatabase from '../../../helpers/apiDatabase/index';

import './User.css';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAsyncWorking: false
        };
        this.updateUser = this.updateUser.bind(this);
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return Promise.all([
            apiDatabase.users.find(userId)
        ]);
    }

    updateUser(event) {
        console.log('update');
    }

    render() {
        let userId = authHelper.userId;
        let user = this.props.users[userId];
        return (
            <Modal size="lg" isOpen={this.props.isOpen} toggle={this.props.close} className="user-modal-content">
                <ModalHeader toggle={this.props.close}></ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>ID: </Label>
                        <Input type="text" defaultValue={user ? user._id : ''} disabled={true}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>公司: </Label>
                        <Input type="text" defaultValue={user ? user.company : ''}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>電話: </Label>
                        <Input type="text" defaultValue={user ? user.phone : ''}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>郵件: </Label>
                        <Input type="text" defaultValue={user ? user.email : ''} disabled={true}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>地址: </Label>
                        <Input type="text" defaultValue={user ? user.address : ''}/>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" onClick={this.updateUser} disabled={this.state.isAsyncWorking}>修改</Button>{' '}
                    <Button outline color="danger" onClick={this.props.close}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
};

User.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    users: PropTypes.object
};

const mapStateToProps = (storeState, ownProps) => {
    return {
        users: storeState.users
    };
};

export default connect(mapStateToProps)(User);
