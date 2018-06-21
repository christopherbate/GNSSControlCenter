import React, { Component } from 'react';
import { Panel, Modal, Button, Tab, Tabs, Table, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ControlBlock from './ControlBlock';
import AGCPlots from '../charts/AGCPlot';

import ExpDetail from './ExpDetail';

import EventDetail from './EventDetail';

import withAuthorization from '../HOCs/withAuthorization';
import withExpInfo from '../HOCs/withExpInfo';

class ExpControl extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeKey: 1,
            terminatedShow: false,
            dataLimitSec: 10
        }
    }
    componentDidMount() {
        if (this.props.expData === null) {
            this.setState({
                terminatedShow: true
            });
        }
    }
    render() {
        return (
            <div>
                <Tabs activeKey={this.state.activeKey} onSelect={(key) => { this.setState({ activeKey: key }) }} id="controlled-tab" >

                    <Tab title="Experiment Information" eventKey={1} >
                        <br />
                        <ExpDetail expData={this.props.expData} nodeGroupData={this.props.nodeGroupData} expKey={this.props.match.params.id} />
                    </Tab>

                    <Tab eventKey={2} title="AGC Information" >
                        <br />
                        <Alert bsStyle="warning">
                            <strong>Notice:</strong> AGC displayed on these charts is realtime, but only displays the last {this.state.dataLimitSec} seconds onward.
                        </Alert>
                        <AGCPlots nodeList={this.props.nodeGroupData} dataLimit={this.state.dataLimitSec} />
                    </Tab>

                    <Tab eventKey={3} title="Experiment Control" >
                        <br />
                        {
                            this.props.nodeGroupData && this.props.expData ?
                                <ControlBlock nodeList={this.props.nodeGroupData} controlState={this.props.expData.status} expKey={this.props.match.params.id} expData={this.props.expData} /> :
                                null
                        }
                    </Tab>

                    <Tab eventKey={4} title="Events" >
                        <br />
                        <Panel>
                            <Panel.Heading>
                                Events
                        </Panel.Heading>

                            <Panel.Body>
                                <Table striped bordered hover condensed>
                                    <thead>
                                        <tr>
                                            <th>Detection Time</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.expData && this.props.expData.events ?
                                                Object.keys(this.props.expData.events).map((eventKey, index) => (
                                                    <tr key={index}>
                                                        <td>{(new Date(this.props.expData.events[eventKey].detectTime)).toISOString()}</td>

                                                        <EventDetail eventData={this.props.expData.events[eventKey]} />
                                                    </tr>
                                                )) : null
                                        }
                                    </tbody>
                                </Table>
                            </Panel.Body>
                        </Panel>
                    </Tab>

                </Tabs>

                <Modal show={this.state.terminatedShow} onHide={() => (this.setState({ terminatedShow: false }))} >
                    <Modal.Header>
                        <Modal.Title>This Experiment Has Been Terminated Or Is Loading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Link to={"/experiments/"}><Button bsStyle="primary">Return to Experiments Page</Button></Link>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withExpInfo((ExpControl)));