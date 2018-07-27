import React from 'react';
import { Fade, TabPane, Row, Col } from 'reactstrap';

class UsersTabPane extends React.Component {
    render() {
        return (
            <TabPane tabId="1" className="m-3">
                <Row>
                    <Col sm="12">
                        <Fade>
                            <h4>基本設定</h4>
                        </Fade>
                    </Col>
                </Row>
            </TabPane>
        );
    }
}

export default UsersTabPane;
