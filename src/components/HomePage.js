import React, { Component } from 'react';
import './App.css';
import MessageBlock from './MessageBlock';
import SystemMap from './SystemMap';
import withAuthorization from './withAuthorization';
import { Grid, Panel, Row, Col } from 'react-bootstrap';
import NodeList from './NodeList';
import StatusBlock from './StatusBlock';
import ControlBlock from './ControlBlock';
import { firebase } from '../firebase/index';
import AGCPlot from './AGCPlot';

class HomePage extends Component {

  constructor(props) {
    super(props);

    this.nodeList = {};
    this.specPlots = {};
    this.dataListKeys = {};
    this.positions = {};

    this.state = {
      nodeList: {},
      dataListKeys: {},
      specPlots: {},
      positions: {}
    };
  }

  componentWillMount() {
    let nodeListRef = firebase.db.ref('/nodes').orderByKey();

    firebase.db.ref('/markers').on("child_added", (snap) => {
      this.positions[snap.val().name] = [snap.val().long, snap.val().lat];
      this.setState({positions: this.positions});
    });

    nodeListRef.on('child_added', (snapshot) => {
      console.log("Node Added: " + snapshot.val().name);
      this.nodeList[snapshot.key] = snapshot.val();
      if(snapshot.val().position){
        console.log(snapshot.val().name + " " + snapshot.val().position);
        this.positions[snapshot.val().name] = [snapshot.val().position.long, snapshot.val().position.lat];
      }
      // Add listeners to AGC plots.
      // Listen for addition of data streams
      firebase.db.ref('/nodes/' + snapshot.key + "/currentAGCplots").on('child_added', (snap) => {
        // Listen for addition of data on the streams
        console.log("Adding AGC plot key for node: " + snap.ref.parent.ref.parent.key);
        this.dataListKeys[snap.ref.parent.ref.parent.key] = snap.val();
        this.setState({ nodeList: this.nodeList, dataListKeys: this.dataListKeys });
      });
      firebase.db.ref('/nodes/' + snapshot.key + "/currentAGCplots").on('child_removed', (snap) => {
        // Listen for addition of data on the streams
        console.log("Clearing AGC plot key for node: " + snap.ref.parent.key);
        delete this.dataListKeys[snap.ref.parent.ref.parent.key];
        this.setState({ nodeList: this.nodeList, dataListKeys: this.dataListKeys });
      });
      firebase.db.ref('/nodes/'+snapshot.key+"/currentSpecPlotGSloc").on('value', (snap) => {
        console.log("Updated spec plot for node: " + snap.ref.parent.key );
        if(snap.val()) {
          this.specPlots[snap.ref.parent.key] = snap.val();
          this.setState({specPlots: this.specPlots});
        }
      });
      /*firebase.db.ref('/nodes/'+snapshot.key+"/position").on('value',(snap) => {
        if(snap.val()){
          console.log("Got updated position: " + snap.ref.parent.key);
          let longLat = [snap.val().long, snap.val().lat];
          this.positions[snap.ref.parent.key] = longLat;
          this.setState({positions: this.positions});
        }
      });*/

      this.setState({ nodeList: this.nodeList, dataListKeys: this.dataListKeys, positions: this.positions });
    });

    nodeListRef.on('child_removed', (snapshot) => {
      console.log("Node removed.");
      if (!snapshot) { return; }
      delete this.nodeList[snapshot.key];
      delete this.positions[snapshot.key];
      this.setState({ nodeList: this.nodeList, dataListKeys: this.dataListKeys });
    })

    nodeListRef.on('child_changed', (snapshot) => {
      console.log("Node changed");
      if(snapshot.val().position){
        console.log(snapshot.val().name + " " + snapshot.val().position);
        this.positions[snapshot.val().name] = [snapshot.val().position.long, snapshot.val().position.lat];
      }
      this.nodeList[snapshot.key] = snapshot.val();
      this.setState({ nodeList: this.nodeList, dataListKeys: this.dataListKeys, positions: this.positions });
    })
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
              <Panel.Body><ControlBlock nodeList={this.nodeList} /></Panel.Body>
            </Panel>
          </Col> 
        </Row>
        
        <Row>
          <Col xs={12} md={12}>
            <AGCPlot streamList={this.state.dataListKeys} specPlots={this.state.specPlots}/>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={12}>
            <Panel>
              <Panel.Heading>System Map</Panel.Heading>
              <Panel.Body><SystemMap mapHeight={200} mapWidth={200} positions={this.state.positions} /> </Panel.Body>
            </Panel>
          </Col>
        </Row>
        
      </Grid>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);