import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import dbapi from '../../../helpers/databaseApi/index';
import authHelper from '../../../helpers/authentication';
import { DAY, formatDate, formatTime } from '../../../utils/unitTime';
import { notify } from '../../Notify/Notify';

const appTypes = dbapi.apps.enums.type;

class AutoreplyInsert extends React.Component {
    render() {
        let apps = 0 === Object.keys(this.props.apps).length ? {} : this.props.apps;
        let appsAutoreplies = 0 === Object.keys(this.props.appsAutoreplies).length ? {} : this.props.appsAutoreplies;
        let appIds = Object.keys(apps).filter((id) => ('' !== apps[id].id1.trim()));
        return (
            <Modal size="lg" isOpen={this.props.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}>
                    新增自動回覆訊息
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Apps: </Label>
                        <Input type="select">
                            { appIds.map((id, index) => (<option key={index} id={id}>{apps[id].name}</option>)) }
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>事件名稱(不可重複): </Label>
                        <Input type="text" />
                    </FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>開始日期</InputGroupText>
                        </InputGroupAddon>
                        <Input type="datetime-local" />
                        <InputGroupAddon addonType="append">
                            <InputGroupText><i className="pointer fas fa-calendar-alt"></i></InputGroupText>
                        </InputGroupAddon>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>結束日期</InputGroupText>
                        </InputGroupAddon>
                        <Input type="datetime-local" />
                        <InputGroupAddon addonType="append">
                            <InputGroupText><i className="pointer fas fa-calendar-alt"></i></InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                    <br/>
                    <FormGroup>
                        <Label>自動回覆訊息: </Label>
                        <Input type="textarea" />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="info">新增</Button>
                    <Button color="link" onClick={this.props.close}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

AutoreplyInsert.propTypes = {
    apps: PropTypes.object,
    appsAutoreplies: PropTypes.object,
    isOpen: PropTypes.bool,
    close: PropTypes.func
};

export default AutoreplyInsert;
