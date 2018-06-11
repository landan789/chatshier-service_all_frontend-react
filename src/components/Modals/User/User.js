import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

import authHelper from '../../../helpers/authentication';
import apiDatabase from '../../../helpers/apiDatabase/index';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';

import './User.css';

class User extends ModalCore {
    static propTypes = {
        users: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen,
            isAsyncWorking: false,
            id: '',
            email: '',
            company: '',
            phone: '',
            address: ''
        };

        this.updateUser = this.updateUser.bind(this);
        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return userId && apiDatabase.users.find(userId);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let userId = authHelper.userId;
        let user = nextProps.users ? nextProps.users[userId] : {};
        let userLength = Object.keys(user).length;
        if (0 < userLength) {
            this.setState({
                id: user._id,
                email: user.email,
                company: user.company,
                phone: user.phone,
                address: user.address
            });
        }
    }

    updateUser(ev) {
        let userId = authHelper.userId;
        let user = {
            company: this.state.company,
            phone: this.state.phone,
            address: this.state.address
        };

        this.setState({ isAsyncWorking: true });
        return apiDatabase.users.update(userId, user).then(() => {
            this.setState({
                isOpen: false,
                isAsyncWorking: false
            });
            return notify('修改成功', { type: 'success' });
        }).then(() => {
            return this.closeModal(ev);
        }).catch(() => {
            this.setState({ isAsyncWorking: false });
            return notify('修改失敗', { type: 'danger' });
        });
    }

    handleCompanyChange(event) {
        this.setState({company: event.target.value});
    }

    handlePhoneChange(event) {
        this.setState({ phone: event.target.value });
    }

    handleAddressChange(event) {
        this.setState({ address: event.target.value });
    }

    render() {
        return (
            <Modal className="user-modal" size="lg" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}></ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>ID:</Label>
                        <Input type="text" value={this.state.id} disabled={true}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>公司:</Label>
                        <Input type="text" value={this.state.company} onChange={this.handleCompanyChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>電話:</Label>
                        <Input type="text" value={this.state.phone} onChange={this.handlePhoneChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>郵件:</Label>
                        <Input type="text" value={this.state.email} disabled={true}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>地址:</Label>
                        <Input type="text" value={this.state.address} onChange={this.handleAddressChange}/>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" onClick={this.updateUser} disabled={this.state.isAsyncWorking}>修改</Button>
                    <Button outline color="danger" onClick={this.closeModal}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    return {
        users: storeState.users
    };
};

export default connect(mapStateToProps)(User);
