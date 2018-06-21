import React from 'react';
import { Panel, Col } from 'react-bootstrap';

import AGCChart_rechart from './AGCChart_rechart';

class AGCHistPlots extends React.Component {
    constructor(props) {
        super(props);
        this.downloadUrls = {};
        this.state = { downloadUrls: {} };
    }

    render() {
        return (
            <div>
                {
                    this.props.nodeList ?
                        Object.keys(this.props.nodeList).map((nodeName, index) => (
                            <Col md={12} xs={12} key={index}>
                                <Panel>
                                    <Panel.Heading>AGC Data - {nodeName}</Panel.Heading>
                                    <Panel.Body>
                                        {
                                            !!this.props.nodeList[nodeName] ?
                                                (<AGCChart_rechart singleUse={true} key={index} dataLimit={this.props.dataLimit} streamKey={this.props.nodeList[nodeName]} />)
                                                : (null)
                                        }
                                    </Panel.Body>
                                </Panel>
                            </Col>
                        )) : null
                }
            </div>
        );
    }
};

export default AGCHistPlots;