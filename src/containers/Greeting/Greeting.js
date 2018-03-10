import React from 'react';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';

import './Greeting.css';

class Greeting extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            updatedTime: Date.now(),
            type: 'text',
            text: '',
            isDeleted: 0
        };

        this.textChanged = this.textChanged.bind(this);
    }

    componentWillMount() {

    }

    textChanged(ev) {
        this.setState({ text: ev.target.value });
    }

    render() {
        return (
            <div>
                <Toolbar />
                <p>Hi</p>
            </div>
        );
    }
}

export default Greeting;
