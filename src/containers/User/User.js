import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

import './User.css';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAsyncWorking: false,
            style: {'z-index': '0'}
        };
        this.updateStyle = this.updateStyle.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }
    updateStyle() {
        this.setState({style: {'z-index': '2000'}});
    }
    updateUser(event) {
    }
    render() {
        return (
            <div className="user-screen" style={this.state.style}>
                <Modal size="lg" isOpen={this.props.isOpen} toggle={this.props.close}>
                    <ModalHeader toggle={this.props.close}></ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label>ID: </Label>
                            <Input type="text" defaultValue={this.props.id}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>公司: </Label>
                            <Input type="text" defaultValue={this.props.company}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>電話: </Label>
                            <Input type="text" defaultValue={this.props.phone}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Email: </Label>
                            <Input type="text" defaultValue={this.props.email}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>地址: </Label>
                            <Input type="text" defaultValue={this.props.address}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="success" onClick={this.updateUser} disabled={this.state.isAsyncWorking}>修改</Button>{' '}
                        <Button outline color="danger" onClick={this.props.close}>取消</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
};

User.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    id: PropTypes.string,
    company: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string
};

export default User;
