import React from 'react';
import { Fade, TabPane, Row, Col } from 'reactstrap';

class TagsTabPane extends React.Component {
    render() {
        return (
            <TabPane tabId="1" className="my-3">
                <Row>
                    <Col sm="12">
                        <Fade>
                            <h4>客戶分類條件</h4>
                        </Fade>
                    </Col>
                </Row>
            </TabPane>
        );
    }
}

export default TagsTabPane;
