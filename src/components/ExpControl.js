import React, { Component } from 'react';
import { Grid, Panel, Modal,Row, Col, Button, Tab, Tabs, Table } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import MessageBlock from './MessageBlock';
import SystemMap from './SystemMap';
import withAuthorization from './withAuthorization';
import NodeList from './NodeList';
import StatusBlock from './StatusBlock';
import ControlBlock from './ControlBlock';
import AGCPlots from './AGCPlot';
import withExpInfo from './withExpInfo';

class ExpControl extends Component {

    constructor(props) {
        super(props);

        this.centerMap = [-105.035857, 39.912612];
        this.state = {
            centerMap: this.centerMap,
            activeKey: 1,
            terminatedShow: false
        }
    }
    componentDidMount(){
        if(this.props.expData === null) {
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
                                                <MessageBlock dataLoc={'/expinfo_a/' + this.props.match.params.id + '/messages'} /> :
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
                                        {
                                            this.props.nodeGroupData ?
                                                <SystemMap mapWidth={200} centerMap={this.state.centerMap} nodeList={this.props.nodeGroupData} />
                                                : null
                                        }
                                    </Panel.Body>
                                </Panel>
                            </Col>
                        </Row>
                    </Grid>
                </Tab>
                <Tab eventKey={2} title="AGC Information" >
                    <br />
                    <AGCPlots nodeList={this.props.nodeGroupData} />
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
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Time</th>                                                                                
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.expData && this.props.expData.events ?
                                        Object.keys(this.props.expData.events).map((eventKey,index) =>(
                                            <tr>
                                                <td>{(new Date(this.props.expData.events[eventKey].detectTime)).toISOString()}</td>
                                            </tr>
                                        )) : null
                                    }
                                </tbody>
                            </Table>
                        </Panel.Body>
                    </Panel>
                </Tab>

            </Tabs>
            <Modal show={this.state.terminatedShow} onHide={ ()=>( this.setState({terminatedShow: false}) )} >
            <Modal.Header>
                <Modal.Title>This Experiment Has Been Terminated</Modal.Title>
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