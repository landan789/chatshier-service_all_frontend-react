import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';

import { Collapse, ListGroup, ListGroupItem } from 'reactstrap';

import './SideMenu.css';

class SideMenu extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            itemCollapse: {}
        };
    }

    toggleItem(key) {
        let itemCollapse = this.state.itemCollapse;
        itemCollapse[key] = !itemCollapse[key];
        this.setState({ itemCollapse: itemCollapse });
    }

    render() {
        let props = this.props;
        let showBackdrop = 'sm' === props.gridState;
        let isOpen = props.isOpen || 'sm' !== props.gridState;
        if (!isOpen) {
            return null;
        }

        let items = props.items || [];
        return (
            <Aux>
                <section className={'chsr side-menu ' + props.gridState}>
                    <ListGroup>
                        <ListGroupItem className="text-light">
                            <span className="side-menu-title">Chatshier</span>
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
                </section>
                {showBackdrop ? <div className="side-menu-backdrop" onClick={() => props.close()}></div> : null}
            </Aux>
        );
    }
}

SideMenu.propTypes = {
    gridState: PropTypes.string,
    items: PropTypes.array.isRequired,
    close: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
};

export default SideMenu;
