import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody,
    ModalFooter, FormGroup, InputGroup,
    InputGroupButtonDropdown, InputGroupAddon, DropdownItem,
    DropdownToggle, DropdownMenu } from 'reactstrap';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../../i18n';

import authHelper from '../../../helpers/authentication';
import apiDatabase from '../../../helpers/apiDatabase/index';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';

class GroupEditModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        groupId: PropTypes.string.isRequired,
        groups: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        let group = this.props.groups[this.props.groupId];
        this.state = {
            isOpen: this.props.isOpen,
            isProcessing: false,
            groupName: group.name || ''
        };

        this.memberSelf = this.findMemberSelf(this.props.groupId);

        this.updateGroup = this.updateGroup.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    updateGroup(ev) {
        let groupId = this.props.groupId;
        let group = {
            groupName: this.state.groupName
        };

        this.setState({ isProcessing: true });
        return apiDatabase.groups.update(groupId, group).then(() => {
            this.setState({
                isOpen: false,
                isProcessing: false
            });
            return notify('update successful!', { type: 'success' });
        }).then(() => {
            return this.closeModal(ev);
        }).catch(() => {
            this.setState({ isProcessing: false });
            return notify('Failed to update!', { type: 'danger' });
        });
    }

    findMemberSelf(groupId) {
        let group = this.props.groups[groupId];
        let members = group.members;
        let userId = authHelper.userId;

        for (let memberId in members) {
            let member = members[memberId];
            if (member.user_id === userId) {
                return member;
            }
        }
    }

    renderMembers() {

    }

    render() {
        let MEMBER_TYPES = apiDatabase.groupsMembers.TYPES;

        return (
            <Modal className="group-insert-modal" size="lg" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    <Trans i18nKey="Edit group" />
                </ModalHeader>

                <ModalBody>
                    <form className="group-form">
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                <span><Trans i18nKey="Group name" />:</span>
                            </label>
                            <div className="input-container">
                                <InputGroup className="group-name">
                                    <input className="group-name-input form-control"
                                        type="text"
                                        name="groupName"
                                        value={this.state.groupName}
                                        placeholder={this.props.t('My group')}
                                        onChange={(ev) => this.setState({ groupName: ev.target.value })} />
                                    <InputGroupAddon addonType="append">
                                        <Button type="button" color="primary">
                                            <span className="px-1"><Trans i18nKey="Update" /></span>
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                        </FormGroup>

                        {(MEMBER_TYPES.OWNER === this.memberSelf.type || MEMBER_TYPES.ADMIN === this.memberSelf.type) &&
                        <div className="w-100 user-invite permission">
                            <InputGroup className="justify-content-end">
                                <input className="user-email form-control typeahead"
                                    type="email"
                                    placeholder={this.props.t('Email')}
                                    autoComplete="off"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    autoFocus="false" />
                            </InputGroup>

                            <InputGroup className="justify-content-end">
                                <InputGroupButtonDropdown addonType="append" isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
                                    <DropdownToggle caret color="light" className="btn-border">
                                        <span className="permission-text"><Trans i18nKey="Permission" /></span>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>READ</DropdownItem>
                                        <DropdownItem>WRITE</DropdownItem>
                                        <DropdownItem>ADMIN</DropdownItem>
                                    </DropdownMenu>
                                </InputGroupButtonDropdown>

                                <InputGroupAddon addonType="append">
                                    <Button type="button" color="light" className="btn-border">
                                        <span className="px-1"><Trans i18nKey="Invite" /></span>
                                        <i className="fas fa-user-plus"></i>
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>}
                    </form>
                </ModalBody>

                <ModalFooter>
                    <Button color="secondary" onClick={this.closeModal}>
                        <Trans i18nKey="Close" />
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

export default withTranslate(connect(mapStateToProps)(GroupEditModal));
