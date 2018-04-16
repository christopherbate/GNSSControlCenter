import React, { Component } from 'react';
import './App.css';
import MessageBlock from './MessageBlock';
import SystemMap from './SystemMap';
import withAuthorization from './withAuthorization';
import {Grid,Panel,Row,Col} from 'react-bootstrap';
import NodeList from './NodeList';
import StatusBlock from './StatusBlock';
import ControlBlock from './ControlBlock';
import {firebase} from '../firebase/index';
import AGCPlot from './AGCPlot';

class HomePage extends Component {

  constructor(props){
    super(props);

    this.nodeList = [];

    this.state = {
        nodeList: []
    };
  }

  removeNodeByKey(key){
    if(!this.nodeList){
        return;
    }
    let i,len = this.nodeList.length;

    for(i=0; i < len; i++){
      if(this.nodeList[i].id === key){
          this.nodeList.splice(i,1);
      }
    }
  }

  updateNodeByKey(key,name,status){
    if(!this.nodeList){
        return;
    }

    let i,len = this.nodeList.length;
    for(i=0; i < len; i++){
      if(this.nodeList[i].id === key){
          this.nodeList[i].name = name;
          this.nodeList[i].status = status;
      }
    }
  }

  componentWillMount(){
    let messageRef = firebase.db.ref('/nodes').orderByKey().limitToLast(10);
    messageRef.on('child_added', (snapshot) => {
        let node = {name: snapshot.val().name, id: snapshot.key, status: snapshot.val().status};
        this.nodeList.push(node);
        this.setState( {nodeList: this.nodeList } );
    } );

    messageRef.on('child_removed', (snapshot) => {
        this.removeNodeByKey(snapshot.key);
        this.setState( {nodeList: this.nodeList} );
    })

    messageRef.on('child_changed', (snapshot) => {
        this.updateNodeByKey(snapshot.key,snapshot.val().name,snapshot.val().status);
        this.setState({nodeList: this.nodeList});
    })
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={6} md={2}>
            <Panel>
              <Panel.Heading>Nodes Online</Panel.Heading>
              <Panel.Body><NodeList nodeList={this.nodeList}/></Panel.Body>
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
        <Row>
          <Col xs={12} md={12}>
            <AGCPlot nodeList={this.nodeList}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);