import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Aux from 'react-aux';

import { Collapse, ListGroup, ListGroupItem } from 'reactstrap';

import './SideMenu.css';

/**
 * 由於 layout 的關係 SideMenu 必須與主內容共享 flexbox 寬度
 * 因此使用特殊方式將 jsx render 至 DOM 特定的位置
 */
class SideMenu extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        /** @type {HTMLElement} */
        this.sideMenu = null;
        /** @type {HTMLElement} */
        this.sideMenuBackdrop = null;

        this.charshierRoot = document.getElementById('charshierRoot');

        this.state = {
            itemCollapse: {}
        };
    }

    componentDidMount() {
        this.mountNode();
        ReactDOM.render(this.generateSideMenu(), this.sideMenu);
    }

    componentWillReceiveProps(props) {
        if ('sm' === props.gridState && !props.isOpen) {
            this.unmountNode();
            return;
        }

        if (!this.sideMenu) {
            this.mountNode('sm' === props.gridState);
        }
        ReactDOM.render(this.generateSideMenu(), this.sideMenu);
    }

    componentWillUnmount() {
        this.unmountNode();
    }

    mountNode(includeBackdrop) {
        this.sideMenu = document.createElement('section');
        if (includeBackdrop) {
            this.sideMenuBackdrop = document.createElement('div');
            this.sideMenuBackdrop.className = 'd-sm-none side-menu-backdrop';
            this.charshierRoot.insertBefore(this.sideMenuBackdrop, this.charshierRoot.firstChild);
        }
        this.charshierRoot.insertBefore(this.sideMenu, this.charshierRoot.firstChild);
    }

    unmountNode() {
        if (this.sideMenu) {
            ReactDOM.unmountComponentAtNode(this.sideMenu);
            this.charshierRoot.removeChild(this.sideMenu);
        }
        if (this.sideMenuBackdrop) {
            this.charshierRoot.removeChild(this.sideMenuBackdrop);
        }
        this.sideMenu = this.sideMenuBackdrop = void 0;
    }

    toggleItem(key) {
        let itemCollapse = this.state.itemCollapse;
        itemCollapse[key] = !itemCollapse[key];
        this.setState({ itemCollapse: itemCollapse });
        ReactDOM.render(this.generateSideMenu(), this.sideMenu);
    }

    generateSideMenu() {
        let props = this.props;
        let items = props.items || [];
        this.sideMenu.className = 'chsr side-menu ' + this.props.gridState;

        return (
            <ListGroup>
                <ListGroupItem className="text-light" onClick={() => props.close()}>
                    <span className="side-menu-title">Chatshier</span>
                    <i className="float-right py-1 fas fa-bars d-sm-none menu-toggle"></i>
                </ListGroupItem>

                {items.map((item, i) => {
                    if (item.rightSide) {
                        return null;
                    }

                    if (item.dropdownItems) {
                        return (
                            <Aux key={i} >
                                <ListGroupItem className="text-light" onClick={() => this.toggleItem(i)}>
                                    <i className={item.icon}></i>
                                    <span>{item.text}</span>
                                    <i className={'float-right py-1 fas ' + (this.state.itemCollapse[i] ? 'fa-chevron-up' : 'fa-chevron-down')}></i>
                                </ListGroupItem>
                                <Collapse isOpen={!this.state.itemCollapse[i]}>
                                    {item.dropdownItems.map((dropdownItem, j) => (
                                        <ListGroupItem className="text-light nested" key={j} onClick={() => props.close(dropdownItem.link, dropdownItem.useReactRouter)}>
                                            <i className={dropdownItem.icon}></i>
                                            <span>{dropdownItem.text}</span>
                                        </ListGroupItem>
                                    ))}
                                </Collapse>
                            </Aux>
                        );
                    }

                    return (
                        <ListGroupItem className="text-light" key={i} onClick={() => props.close(item.link, item.useReactRouter)}>
                            <i className={item.icon}></i>
                            <span>{item.text}</span>
                        </ListGroupItem>
                    );
                })}
            </ListGroup>
        );
    }

    render() {
        return null;
    }
}

SideMenu.propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    gridState: PropTypes.string,
    items: PropTypes.array.isRequired,
    close: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
};

export default SideMenu;
