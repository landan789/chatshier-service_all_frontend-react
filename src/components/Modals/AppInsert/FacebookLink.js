import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../../i18n';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter, FormGroup } from 'reactstrap';
import ModalCore from '../ModalCore';

class FacebookLinkModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        fanPages: PropTypes.array,
        fanPagePics: PropTypes.array
    }

    static defaultProps = {
        fanPages: [],
        fanPagePics: []
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isOpen: this.props.isOpen,
            checkedPages: {}
        };

        this.prepareApps = this.prepareApps.bind(this);
    }

    onCheckChanged(ev, i) {
        let checkedPages = this.state.checkedPages;
        checkedPages[i] = ev.target.checked;
        this.setState({ checkedPages: checkedPages });
    }

    prepareApps() {
        let checkedPages = this.state.checkedPages;
        let selectedFanPages = [];
        for (let i in checkedPages) {
            if (!checkedPages[i]) {
                continue;
            }
            selectedFanPages.push(this.props.fanPages[parseInt(i, 10)]);
        }

        this.setState({ isOpen: false });
        return this.closeModal(selectedFanPages);
    }

    render() {
        return (
            <Modal className="fb-link-modal" isOpen={this.state.isOpen} toggle={() => this.closeModal([])}>
                <ModalHeader toggle={() => this.closeModal([])}>
                    選取連結的粉絲專頁
                </ModalHeader>
                <ModalBody>
                    {this.props.fanPages.map((fanPage, i) => (
                        <FormGroup key={i} className="form-check">
                            <label className="form-check-label">
                                <input className="form-check-input"
                                    type="checkbox"
                                    checked={!!this.state.checkedPages[i]}
                                    onChange={(ev) => this.onCheckChanged(ev, i)} />
                                <img className="mx-2 fb-fanpage-picture" src={this.props.fanPagePics[i].data.url} alt="" />
                                <span>{fanPage.name}</span>
                            </label>
                        </FormGroup>
                    ))}
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={this.prepareApps} disabled={this.state.isProcessing}>
                        <Trans i18nKey="Confirm" />
                    </Button>
                    <Button color="secondary" onClick={() => this.closeModal([])}>
                        <Trans i18nKey="Cancel" />
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default withTranslate(FacebookLinkModal);
