import React from 'react';
import PropTypes from 'prop-types';

class ProfilePanel extends React.Component {
    render() {
        return (
            <div className="profile-panel">
                profilePanel
            </div>
        );
    }
}

ProfilePanel.propTypes = {
    appsChatrooms: PropTypes.object,
    appsFields: PropTypes.object,
    consumers: PropTypes.object,
    users: PropTypes.object
};

export default ProfilePanel;
