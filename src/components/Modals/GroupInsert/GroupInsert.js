import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody,
    ModalFooter, FormGroup } from 'reactstrap';
import { Trans } from 'react-i18next';

import authHelper from '../../../helpers/authentication';
import apiDatabase from '../../../helpers/apiDatabase/index';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';

class GroupInsertModal extends ModalCore {
    static propTypes = {
        groups: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isOpen: this.props.isOpen,
            isProcessing: false,
            groupName: ''
        };

        this.insertGroup = this.insertGroup.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    insertGroup(ev) {
        let group = {
            name: this.state.groupName
        };

        if (!group.name) {
            return notify('Fill the group name', { type: 'warning' });
        }

        let userId = authHelper.userId;
        this.setState({ isProcessing: true });
        return apiDatabase.groups.insert(userId, group).then(() => {
            this.setState({
                isOpen: false,
                isProcessing: false
            });
            return notify('Add successful!', { type: 'success' });
        }).then(() => {
            return this.closeModal(ev);
        }).catch(() => {
            this.setState({ isProcessing: false });
            return notify('Failed to add!', { type: 'danger' });
        });
    }

    render() {
        return (
            <Modal className="group-insert-modal" size="lg" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    <Trans i18nKey="Add group" />
                </ModalHeader>

                <ModalBody>
                    <form className="group-form">
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                <span><Trans i18nKey="Group name" />:</span>
                            </label>
                            <div className="input-container">
                                <input className="form-control"
                                    type="text"
                                    name="groupName"
                                    value={this.state.groupName}
                                    onChange={(ev) => this.setState({ groupName: ev.target.value })} />
                            </div>
                        </FormGroup>
                    </form>
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={this.insertGroup} disabled={this.state.isProcessing}>
                        <Trans i18nKey="Add" />
                    </Button>

                    <Button color="secondary" onClick={this.closeModal}>
                        <Trans i18nKey="Cancel" />
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    return Object.assign({}, ownProps, {
        groups: storeState.groups
    });
};

export default connect(mapStateToProps)(GroupInsertModal);
