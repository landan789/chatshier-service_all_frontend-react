import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';

import CHATSHIER from '../../config/chatshier';
import regex from '../../utils/regex';

import logoPng from '../../image/logo.png';
import './SignForm.css';

const URL = CHATSHIER.URL;
const WWW = URL.WWW
    ? URL.WWW + (80 !== URL.PORT ? ':' + URL.PORT : '')
    : window.location.protocol + '//' + document.domain.replace(regex.domainPrefix, 'www.');

class SignForm extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        subTitle: PropTypes.string,
        onSubmit: PropTypes.func,
        children: PropTypes.oneOfType([ PropTypes.array, PropTypes.element ])
    }

    static defaultProps = {
        title: '',
        subTitle: ''
    }

    render() {
        return (
            <Aux>
                <div className="col-12 text-center sign-logo-container">
                    <a className="chatshier-logo" href={WWW}>
                        <img src={logoPng} alt="Chatshier" />
                    </a>
                </div>
                <div className="mx-auto col-md-12 col-lg-5">
                    <div className="row justify-content-center">
                        <div className="form-container col-12 col-sm-10 col-md-8 col-lg-12">
                            <h2 className="text-center sign-title">{this.props.title}</h2>
                            {this.props.subTitle && <p className="text-center lead">{this.props.subTitle}</p>}

                            <form className="sign-form" onSubmit={this.props.onSubmit}>
                                {this.props.children}
                            </form>
                        </div>
                    </div>
                </div>
            </Aux>
        );
    }
}

export default SignForm;
