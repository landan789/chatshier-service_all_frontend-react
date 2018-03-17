import React from 'react';
import { Fade, TabPane, Row, Col } from 'reactstrap';

class GroupsTabPane extends React.Component {
    render() {
        return (
            <TabPane tabId="1" className="my-3">
                <Row>
                    <Col sm="12">
                        <Fade>
                            <h4>內部群組</h4>
                        </Fade>
                    </Col>
                </Row>
            </TabPane>
        );
    }
}

export default GroupsTabPane;
