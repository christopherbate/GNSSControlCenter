import React, { Component } from 'react';
import { FormGroup, Button, Modal, FormControl, ControlLabel, Checkbox, Label, Table, ProgressBar } from 'react-bootstrap';
import { firebase } from '../firebase/index';
import { Link } from 'react-router-dom';

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
        this.postCommand.bind(this);
    }
    onSelectNode(event) {
        this.selectedNodeList[event.target.value] = event.target.checked;
        this.setState({
            selectedNodeList: this.selectedNodeList
        });
    }
    postCommand(type, value) {
        firebase.db.ref("/command").push().set({
            'type': type,
            'value': value,
            'expKey': null,
            'expName': null
        });
    }
    launchExp() {
        var settings = {
            'expname': this.state.expSetupName,
            'owner': firebase.auth.currentUser.email,
            'selectedNodeList': {}
        }

        // Add node members.
        Object.keys(this.state.selectedNodeList).map((nodeName, index) => {
            if (this.state.selectedNodeList[nodeName] === true) {
                settings.selectedNodeList[nodeName] = true
            }
            return true;
        });

        this.setState({
            successShow: true
        });

        this.postCommand("newexp", settings);
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
                            onChange={(event) => { this.setState({ expSetupName: event.target.value }) }}
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
                                                    !this.props.nodeList[nodeName].group ?
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
                                                {
                                                    !!this.props.nodeList[nodeName].free_space ?
                                                        (<ProgressBar now={100-(this.props.nodeList[nodeName].free_space / 250000)*100} />) :
                                                        (<p>Unknown</p>)
                                                }
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
                <Modal show={this.state.successShow} onHide={() => (this.setState({ successShow: false }))} >
                    <Modal.Header>
                        <Modal.Title>Successfully Setup Experiment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Link to={"/nodes/"}><Button bsStyle="primary">Go To Experiment Control Page</Button></Link>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
};

export default NewExpForm;
