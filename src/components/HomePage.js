import React, { Component } from 'react';
import './App.css';
import MessageBlock from './MessageBlock';
import SystemMap from './SystemMap';
import withAuthorization from './withAuthorization';
import {Grid,Panel,Row,Col} from 'react-bootstrap';
import NodeList from './NodeList';
import StatusBlock from './StatusBlock';
import ControlBlock from './ControlBlock';

class HomePage extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={6} md={2}>
            <Panel>
              <Panel.Heading>Nodes Online</Panel.Heading>
              <Panel.Body><NodeList /></Panel.Body>
            </Panel>
          </Col>
          <Col xs={6} md={2}>
            <Panel>
              <Panel.Heading>Experiment Control</Panel.Heading>
              <Panel.Body><ControlBlock /></Panel.Body>
            </Panel>
          </Col>
          <Col xs={12} md={4}>
            <Panel>
              <Panel.Heading>Node Messages</Panel.Heading>
              <Panel.Body>
                <MessageBlock />
              </Panel.Body>
            </Panel>
          </Col>
          <Col xs={12} md={4}>
            <Panel>
              <Panel.Heading>System Status</Panel.Heading>
              <Panel.Body>
                <StatusBlock />
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
        <Row>
         <Col xs={12} md={12}>
            <Panel>
              <Panel.Heading>System Map</Panel.Heading>
              <Panel.Body><SystemMap mapHeight={200} mapWidth={200} /> </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);