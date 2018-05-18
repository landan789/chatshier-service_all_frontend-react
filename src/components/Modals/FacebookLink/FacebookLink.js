import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../../i18n';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter, FormGroup } from 'reactstrap';

class FacebookLinkModal extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
        fanPages: PropTypes.array,
        fanPagePics: PropTypes.array,
        close: PropTypes.func.isRequired
    }

    static defaultProps = {
        fanPages: [],
        fanPagePics: []
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isOpen: this.props.isOpen
        };
    }

    render() {
        return (
            <Modal className="fb-link-modal" isOpen={this.state.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}>
                    選取連結的粉絲專頁
                </ModalHeader>
                <ModalBody>
                    {this.props.fanPages.map((fanPage, i) => {
                        return (
                            <FormGroup key={i} className="form-check">
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" value={i} />
                                    <img className="mx-2 fb-fanpage-picture" src={this.props.fanPagePics[i].data.url} alt="" />
                                    <span>{fanPage.name}</span>
                                </label>
                            </FormGroup>
                        );
                    })}
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={this.insertApp} disabled={this.state.isProcessing}>
                        <Trans i18nKey="Confirm" />
                    </Button>
                    <Button color="secondary" onClick={this.props.close}>
                        <Trans i18nKey="Cancel" />
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default withTranslate(FacebookLinkModal);
