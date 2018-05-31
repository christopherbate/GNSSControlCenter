import React, { Component } from 'react';
import { Grid, Table, Row, Col, Label,ProgressBar, Button } from 'react-bootstrap';
import withNodeInfo from './withNodeInfo';
import withAuthorization from './withAuthorization';
import {Link} from 'react-router-dom';
import {firebase} from '../firebase/index';

function getTimeString( uptime ){    
    var days = Math.floor(uptime / (24*3600));
    var rem = uptime - days*24*3600;
    var hours = Math.floor((rem) / 3600);
    rem = rem - hours * 3600;
    var min = Math.floor(rem/60);
    rem = rem - min*60;
    return String(days)+" days "+ String(hours) + " Hrs " + String(min) + " min " + rem + " sec";
}

class NodeStatus extends Component {
    constructor(props){
        super(props);
        this.swRestartCmd.bind(this);
    }
    swRestartCmd(e){
        firebase.db.ref('/command').push().set({
            'type': 'swrestart',
            'value': e.target.value
        });
    }
    clearSpace(e){
        firebase.db.ref('/command').push().set({
            'type': 'erasedata',
            'value': e.target.value
        });
    }
    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <div>
                            <Table striped bordered condensed hover responsive>
                                <thead>
                                    <tr>
                                        <th>Node</th>
                                        <th>HW Status</th>
                                        <th>SW Status</th>
                                        <th>Control</th>
                                        <th>Owner</th>
                                        <th>Exp.</th>
                                        <th>Uptime</th>
                                        <th>Errors</th>
                                        <th>Space Utilization</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(this.props.nodeList).map((nodeName, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {nodeName}
                                                </td>
                                                <td>
                                                    {
                                                        this.props.nodeList[nodeName].status === 'offline' ?
                                                            (<Label bsStyle="danger">{this.props.nodeList[nodeName].status}</Label>)
                                                            : (<Label bsStyle="success">{this.props.nodeList[nodeName].status}</Label>)
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        this.props.nodeList[nodeName].swStatus === 'offline' ?
                                                        (<Label bsStyle="danger">{this.props.nodeList[nodeName].swStatus}</Label>)
                                                        : (<Label bsStyle="success">{this.props.nodeList[nodeName].swStatus}</Label>)
                                                    }
                                                </td>
                                                <td>
                                                    <Button bsStyle="success" value={nodeName} onClick={this.swRestartCmd}>SW Restart</Button>
                                                    <Button bsStyle="danger" value={nodeName} onClick={this.clearSpace}>Erase Data</Button>
                                                </td>                                                    
                                                <td>
                                                    {
                                                        !!this.props.nodeList[nodeName].group ?
                                                        (<Label bsStyle="warning">{this.props.nodeList[nodeName].group}</Label>)
                                                        : (<Label bsStyle="success">Not Assigned</Label>)
                                                    }
                                                </td>
                                                <td>                                                    
                                                </td>                                                    
                                                <td>
                                                {
                                                        !!this.props.nodeList[nodeName].uptime ?
                                                        (<Label>{getTimeString(this.props.nodeList[nodeName].uptime)}</Label>) : null
                                                }
                                                </td>
                                                <td>
                                                    {
                                                        this.props.nodeList[nodeName].errcnt !== 0 ?
                                                            (<Label bsStyle="danger">{this.props.nodeList[nodeName].errcnt}</Label>)
                                                            : (<Label bsStyle="success">{this.props.nodeList[nodeName].errcnt}</Label>)
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        !!this.props.nodeList[nodeName].free_space ? 
                                                        (<ProgressBar now={100-(this.props.nodeList[nodeName].free_space/250000)*100} />) :
                                                        (<p>Unknown</p>)
                                                    }                                                    
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}


/// asdf

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withNodeInfo(NodeStatus));