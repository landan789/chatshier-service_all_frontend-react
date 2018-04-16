import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, Collapse, FormGroup, InputGroup, Label, Input } from 'reactstrap';

import authHelper from '../../../helpers/authentication';
import apiDatabase from '../../../helpers/apiDatabase/index';

class Group extends React.Component {
    constructor(props) {
        super(props);
        this.state = { collapse: false };
        this.toggle = this.toggle.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return Promise.all([
            apiDatabase.groups.find(userId)
        ]);
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        return (
            <Modal size="lg" isOpen={this.props.isOpen} toggle={this.props.close} className="user-modal-content">
                <ModalHeader toggle={this.props.close}></ModalHeader>
                <ModalBody>
                    <div className="row">
                        <Button color="link"><i className="fas fa-plus"></i> 新增群組</Button>
                    </div>
                    <div className="row">
                        <Button color="secondary" size="lg" block onClick={this.toggle}>Block level button</Button>
                        <Collapse isOpen={this.state.collapse}>
                            <FormGroup>
                                <Label>ID: </Label>
                                <InputGroup>
                                    <Input
                                        type="text"
                                        className="ticket-search-bar lean-right"/>
                                    <Button color="primary" className="pointer lean-right">更新</Button>
                                </InputGroup>
                            </FormGroup>
                        </Collapse>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

Group.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    groups: PropTypes.object
};

const mapStateToProps = (storeState, ownProps) => {
    return {
        groups: storeState.groups
    };
};

export default connect(mapStateToProps)(Group);
