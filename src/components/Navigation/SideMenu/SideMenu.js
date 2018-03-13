import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import ROUTES from '../../../config/route';

import './SideMenu.css';

const SideMenu = (props) => (
    <section className={'chsr side-menu ' + (props.isOpen ? 'show' : 'hide')}>
        <ListGroup>
            <ListGroupItem onClick={() => props.close(ROUTES.CHAT)}>
                <i className="fas fa-comment-alt fa-fw"></i>
                <span>聊天室</span>
            </ListGroupItem>
            <ListGroupItem onClick={() => props.close('/calendar')}>
                <i className="far fa-calendar-alt fa-fw"></i>
                <span>行事曆</span>
            </ListGroupItem>
            <ListGroupItem onClick={() => props.close(ROUTES.TICKET)}>
                <i className="fa fa-list-ul fa-fw"></i>
                <span>待辦事項</span>
            </ListGroupItem>
            <ListGroupItem onClick={() => props.close('/analyze')}>
                <i className="fa fa-chart-bar fa-fw"></i>
                <span>訊息分析</span>
            </ListGroupItem>
            <ListGroupItem>
                <i className="fa fa-envelope"></i>
                <span>訊息</span>
            </ListGroupItem>
            <ListGroupItem className="nested" onClick={() => props.close('/compose')}>
                <i className="fa fa-comments"></i>
                <span>群發</span>
            </ListGroupItem>
            <ListGroupItem className="nested" onClick={() => props.close('/autoreply')}>
                <i className="fa fa-comments"></i>
                <span>自動回覆</span>
            </ListGroupItem>
            <ListGroupItem className="nested" onClick={() => props.close('/keywordsreply')}>
                <i className="fa fa-comments"></i>
                <span>關鍵字回覆</span>
            </ListGroupItem>
            <ListGroupItem className="nested" onClick={() => props.close(ROUTES.GREETING)}>
                <i className="fa fa-comments"></i>
                <span>加好友回覆</span>
            </ListGroupItem>
            <ListGroupItem onClick={() => props.close(ROUTES.SETTING)}>
                <i className="fa fa-user"></i>
                <span>設定</span>
            </ListGroupItem>
            <ListGroupItem onClick={() => props.close('/logout')}>
                <i className="fa fa-sign-out-alt"></i>
                <span>登出</span>
            </ListGroupItem>
        </ListGroup>
    </section>
);

SideMenu.propTypes = {
    close: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
};

export default SideMenu;
