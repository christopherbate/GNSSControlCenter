import React, { Component } from 'react';
import { Grid, Panel, Row, Col, ProgressBar } from 'react-bootstrap';

import MessageBlock from './MessageBlock';
import SystemMap from './SystemMap';
import NodeList from './NodeList';
import StatusBlock from './StatusBlock';

class ExpDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            centerMap: [-105.035857, 39.912612]
        };
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12} md={6}>
                        <Panel xs={12} md={6}>
                            <Panel.Heading>
                                Nodes in Experiment
                                    </Panel.Heading>
                            <Panel.Body>
                                {
                                    this.props.nodeGroupData ?
                                        <NodeList nodeList={this.props.nodeGroupData} /> :
                                        null
                                }
                            </Panel.Body>
                        </Panel>
                    </Col>
                    <Col xs={12} md={6}>
                        <Panel>
                            <Panel.Heading>
                                Experiment Messages
                            </Panel.Heading>
                            <Panel.Body>
                                {
                                    this.props.expData ?
                                        <MessageBlock dataLoc={'/expinfo_a/' + this.props.expKey + '/messages'} /> :
                                        null
                                }
                            </Panel.Body>
                        </Panel>
                    </Col>
                    <Col xs={12} md={6}>
                        <Panel>
                            <Panel.Heading>
                                Experiment Status
                                    </Panel.Heading>
                            <Panel.Body>
                                {
                                    this.props.expData && this.props.expData.eph ?
                                        <StatusBlock eph={this.props.expData.eph} status={this.props.expData.status} /> :
                                        null
                                }
                                {
                                    this.props.expData && this.props.expData.ephupload ?
                                        <ProgressBar now={(this.props.expData.ephupload / 107000000) * 100} /> : null
                                }
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12}>
                        <Panel>
                            <Panel.Heading>
                                Event Information
                            </Panel.Heading>
                            <Panel.Body>
                                {
                                    this.props.expData ?
                                        null :
                                        null
                                }
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Panel>
                            <Panel.Heading>
                                System Map
                                    </Panel.Heading>
                            <Panel.Body>

                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
};

/*
   {
                                    this.props.nodeGroupData ?
                                        <SystemMap mapWidth={200} centerMap={this.state.centerMap} nodeList={this.props.nodeGroupData} />
                                        : null
                                }
*/

export default ExpDetail;