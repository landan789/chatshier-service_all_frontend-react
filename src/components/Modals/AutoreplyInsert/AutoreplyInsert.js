import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import dbapi from '../../../helpers/databaseApi/index';
import authHelper from '../../../helpers/authentication';
import { DAY } from '../../../utils/unitTime';
import { notify } from '../../Notify/Notify';

const appTypes = dbapi.apps.enums.type;

class AutoreplyInsert extends React.Component {
    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}>
                    新增自動回覆訊息
                </ModalHeader>
                <ModalBody>
                    Check
                </ModalBody>
                <ModalFooter>
                    <Button color="primary">新增</Button>
                    <Button color="secondary" onClick={this.props.close}>取消</Button>
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
