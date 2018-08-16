import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Card } from 'reactstrap';

import ROUTES from '../../config/route';
import authHlp from '../../helpers/authentication';
import browserHlp from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';

import KeywordreplyModal from '../../components/Modals/KeywordreplyInsert/KeywordreplyInsert';
import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import KeywordreplyTable from '../Keywordreplies/KeywordreplyTable';

import './Keywordreplies.css';

class Keywordreplies extends React.Component {
    static propTypes = {
        apps: PropTypes.object,
        appsKeywordreplies: PropTypes.object,
        history: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        browserHlp.setTitle('關鍵字回覆');
        if (!authHlp.hasSignedin()) {
            return props.history.replace(ROUTES.SIGNOUT);
        }

        this.state = {
            searchKeyword: '',
            appId: '',
            isModalOpen: false
        };

        this.onKeywordChanged = this.onKeywordChanged.bind(this);
    }

    componentDidMount() {
        return Promise.all([
            apiDatabase.apps.find(),
            apiDatabase.appsKeywordreplies.find()
        ]);
    }

    onKeywordChanged(ev) {
        this.setState({ searchKeyword: ev.target.value });
    }

    render() {
        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle="關鍵字回覆">
                    <Fade in className="align-items-center mt-5 pb-4 container keywordreplies-wrapper">
                        <Card className="pb-3 shadow chsr">
                            <div className="text-left table-title">
                                <h3 className="mb-4 pt-3 px-3">關鍵字回覆訊息</h3>
                                <p className="mb-3 pt-0 px-3">首頁 / 訊息 / 關鍵字回覆</p>
                                <p className="mb-3 pt-0 px-3 text-muted small">當您的客戶對機器人傳送訊息時，符合設定之關鍵字訊息將自動回覆</p>
                            </div>

                            <AppsSelector className="px-3 my-3" onChange={(appId) => this.setState({ appId: appId })} />

                            <KeywordreplyTable appId={this.state.appId} keyword={this.state.searchKeyword} />
                        </Card>
                    </Fade>
                </PageWrapper>

                {this.state.isModalOpen &&
                <KeywordreplyModal
                    apps={this.props.apps}
                    isOpen={this.state.isModalOpen}
                    close={this.closeModal}>
                </KeywordreplyModal>}
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return Object.assign({}, ownProps, {
        apps: storeState.apps,
        appsKeywordreplies: storeState.appsKeywordreplies
    });
};

export default withRouter(connect(mapStateToProps)(Keywordreplies));
