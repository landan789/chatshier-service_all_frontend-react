import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

import './User.css';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {'z-index': '0'}
        };
    }
    render() {
        return (
            <div className="user-screen" style={this.state.style}>
                <Modal size="lg" isOpen={this.props.isOpen} toggle={this.props.close}>
                    <ModalHeader toggle={this.props.close}>
                        修改自動回覆訊息
                    </ModalHeader>
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
                        <Button outline color="success" onClick={this.updateAutoreply} disabled={this.state.isAsyncWorking}>修改</Button>{' '}
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
