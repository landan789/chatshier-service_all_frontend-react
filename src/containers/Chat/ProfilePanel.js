import React from 'react';
import PropTypes from 'prop-types';

class ProfilePanel extends React.Component {
    static propTypes = {
        appsChatrooms: PropTypes.object,
        appsFields: PropTypes.object,
        consumers: PropTypes.object,
        users: PropTypes.object
    }

    render() {
        return (
            <div className="profile-panel">
                profilePanel
            </div>
        );
    }
}

export default ProfilePanel;
