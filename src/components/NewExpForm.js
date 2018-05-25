import React, { Component } from 'react';
import { FormGroup, Button, Modal, FormControl, ControlLabel, Checkbox, Label, Table, ProgressBar } from 'react-bootstrap';
import NodeTableA from './NodeTableA';
import {firebase} from '../firebase/index';
import {Link} from 'react-router-dom';

class NewExpForm extends Component {
    constructor(props) {
        super(props);
        this.selectedNodeList = {};
        this.state = {
            selectedNodeList: {},
            expSetupName: '',
            successShow: false,
            expKey: ''
        };
    }
    onSelectNode(event) {
        this.selectedNodeList[event.target.value] = event.target.checked;
        this.setState({
            selectedNodeList: this.selectedNodeList
        });
    }
    launchExp() {
        // Create new experiment.
        var expRef = firebase.db.ref('/expinfo_a/').push();

        // Update experiment meta-data.
        expRef.update({
            'agcplots': null,
            'expname': this.state.expSetupName,
            'start_time': (new Date).getTime(),
            'status': 'SETUP',
            'owner': firebase.auth.currentUser.email,
            'eph': new Date( (new Date()).getTime()-1000*60*60*2 ),
            'settings': {
                'agcThresh': 7,
                'nomAgc': 12
            }
        });   

        // Add node members.
        Object.keys(this.state.selectedNodeList).map( (nodeName,index) => {
            if(this.state.selectedNodeList[nodeName] === true) {
                expRef.child('nodes/'+nodeName).set({
                    timeAdded: (new Date()).getTime()
                });
                firebase.db.ref('/state/nodes/'+nodeName).update({
                    'group':this.state.expSetupName
                });
            }        
        });

        this.setState({
            expKey: expRef.ref.key,
            successShow: true
        });
    }
    render() {
        return (
            <div>
            <form>
                <FormGroup>
                    <ControlLabel>Experiment Name</ControlLabel>
                    <FormControl
                        type="text"
                        placeholder="testname"
                        value={this.state.expSetupName}
                        onChange={(event)=>{this.setState({expSetupName: event.target.value})}}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Select Nodes</ControlLabel>
                    <Table striped bordered condensed hover responsive>
                        <thead>
                            <tr>
                                <th>Node</th>
                                <th>Status</th>
                                <th>Select</th>
                                <th>Owner</th>
                                <th>Exp.</th>
                                <th>Uptime</th>
                                <th>Errors</th>
                                <th>Free Space</th>
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
                                                !this.props.nodeList[nodeName].currentExp ? 
                                                <Checkbox onClick={this.onSelectNode.bind(this)} value={nodeName} />
                                                : <Label bsStyle="warning">Occupied</Label>
                                            }                                            
                                        </td>
                                        <td>
                                        </td>
                                        <td>
                                        </td>
                                        <td>
                                        </td>
                                        <td>
                                            {
                                                this.props.nodeList[nodeName].errcnt !== 0 ?
                                                    (<Label bsStyle="danger">{this.props.nodeList[nodeName].errcnt}</Label>)
                                                    : (<Label bsStyle="success">{this.props.nodeList[nodeName].errcnt}</Label>)
                                            }
                                        </td>
                                        <td>
                                            <ProgressBar now={60} />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Start Experiment</ControlLabel> 
                    <br />
                    <Button bsStyle="success" onClick={this.launchExp.bind(this)}>Launch</Button>
                </FormGroup>
            </form>
            <Modal show={this.state.successShow} onHide={ ()=>( this.setState({successShow: false}) )} >
                <Modal.Header>
                    <Modal.Title>Successfully Setup Experiment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Link to={"/experiments/"+this.state.expKey}><Button bsStyle="primary">Go To Experiment Control Page</Button></Link>
                </Modal.Body>
            </Modal>
            </div>
        );
    }
};

export default NewExpForm;
