import React, { Component } from 'react';
import { Grid, Panel, Row, Col, Button } from 'react-bootstrap';
import { firebase } from '../firebase/index';

import MessageBlock from './MessageBlock';
import SystemMap from './SystemMap';
import withAuthorization from './withAuthorization';
import NodeList from './NodeList';
import StatusBlock from './StatusBlock';
import ControlBlock from './ControlBlock';
import AGCPlots from './AGCPlot';

class HomePage extends Component {

  constructor(props) {
    super(props);

    this.nodeList = {};
    this.markerList = {};

    this.state = {
      nodeList: {},
      markerList: {},
      controlState: 'SETUP'
    };
  }

  componentWillMount() {
    firebase.db.ref('/state/markers').on("child_added", (snap) => {
      this.markerList[snap.val().name] = [snap.val().long, snap.val().lat];
      this.setState({ markerList: this.markerList });
    });

    firebase.db.ref('/state/status').on('value', (snap) => {
      this.setState({controlState: snap.val()});
      console.log("Control state set to: " + (snap.val()));
    });

    firebase.db.ref('/state/nodes').on('child_added', (snapshot) => {
      console.log("Node Added: " + snapshot.val().name);
      this.nodeList[snapshot.key] = snapshot.val();
      if (snapshot.val().position) {
        console.log(snapshot.val().name + " " + snapshot.val().position);
        // this.positions[snapshot.val().name] = [snapshot.val().position.long, snapshot.val().position.lat];
      }
      this.setState({ nodeList: this.nodeList, positions: this.positions });
    });

    firebase.db.ref('/state/nodes').on('child_removed', (snapshot) => {
      console.log("Node removed.");
      if (!snapshot) { return; }
      delete this.nodeList[snapshot.key];
      // delete this.positions[snapshot.key];
      this.setState({ nodeList: this.nodeList, dataListKeys: this.dataListKeys });
    });

    firebase.db.ref('/state/nodes').on('child_changed', (snapshot) => {
      console.log("Node changed");
      if (snapshot.val().position) {
        console.log(snapshot.val().name + " " + snapshot.val().position);
        // this.positions[snapshot.val().name] = [snapshot.val().position.long, snapshot.val().position.lat];
      }
      this.nodeList[snapshot.key] = snapshot.val();
      this.setState({ nodeList: this.nodeList, dataListKeys: this.dataListKeys, positions: this.positions });
    });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={6} md={6}>
            <Panel>
              <Panel.Heading>Nodes Online</Panel.Heading>
              <Panel.Body><NodeList nodeList={this.nodeList} /></Panel.Body>
            </Panel>
          </Col>
          <Col xs={6} md={6}>
            <Panel>
              <Panel.Heading>System Status</Panel.Heading>
              <Panel.Body>
                <StatusBlock />
              </Panel.Body>
            </Panel>
          </Col>
          <Col xs={12} md={12}>
            <Panel>
              <Panel.Heading>Node Messages</Panel.Heading>
              <Panel.Body>
                <MessageBlock />
              </Panel.Body>
            </Panel>
          </Col>
          <Col xs={12} md={12}>
            <Panel>
              <Panel.Heading>Experiment Control</Panel.Heading>
              <Panel.Body><ControlBlock nodeList={this.nodeList} controlState={this.state.controlState} /></Panel.Body>
            </Panel>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={12}>
            <AGCPlots nodeList={this.state.nodeList} />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={12}>
            <Panel>
              <Panel.Heading>System Map </Panel.Heading>
              <Panel.Body><Button bsStyle="primary">Center Map on Approx Location</Button><SystemMap mapHeight={200} mapWidth={200} nodeList={this.state.nodeList}/> </Panel.Body>
            </Panel>
          </Col>
        </Row>

      </Grid>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);