import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import {firebase} from '../firebase/index';
import {Grid, Row, Col, Modal, Radio} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {FormGroup,Checkbox,FormControl,ControlLabel, Form} from 'react-bootstrap';
class ControlBlock extends Component {

    constructor(props){
        super(props);
        this.state = {
            buttonPressed: null,
            showEphModal: false,
            showRebootModal: false,
            showTermModal: false,
            rebootNodeName: "mz0",
            ephNodeName: "mz0",
            agcThresh: 7,
            agcThreshChange: 0,
            nominalAGC: 12,
            nominalAGCChange: 0,
            expSetupName: "Enter Name"
        };
    }

    componentWillMount(){
        firebase.db.ref("/expinfo_a/"+this.props.expKey+"/settings/agcThresh").on("value", (snap) => ( 
            this.setState({agcThresh: snap.val()}) 
        ));
        firebase.db.ref("/expinfo_a/"+this.props.expKey+"/settings/nomAgc").on("value", snap => ( 
            this.setState({nominalAGC: snap.val()}) 
        ));
    }

    postCommand( type, value) {
        firebase.db.ref("/command").push().set({
            'type': type,
            'value': value,
            'expkey': this.props.expKey,
            'expname': this.props.expData.expname
        });
    }
    updateExpStatus( status ) {
        firebase.db.ref('/expinfo_a/'+this.props.expKey).update({
            'status': status
        })
    }

    onClickUpdate(e) {
        var ts = Math.round((new Date()).getTime());
        this.postCommand('postupdate', ts);
    }
    //-----------------------------------NODE CONTROL-----------------------------------------------
    onClickRebootNode() {
        this.setState({showRebootModal: false});
        this.postCommand('reboot', this.state.rebootNodeName);
    }
    //------------------------------------EPHEMERIS UPDATE-------------------------------------------
    onClickHideEphModal(){
        this.setState({showEphModal:false});
    }
    onClickEphemeris(e) {
        this.setState({showEphModal: true});
    }
    onClickEphStart(e) {
        this.setState({showEphModal: false});        
        this.postCommand('ephupdate',this.state.ephNodeName);
    }
    onRadioChange(event){
        this.setState({ephNodeName:event.target.value});
    }
    //------------------------------------EXP START AND STOP------------------------------------------
    onClickStopExp(e) {
        // Tell server to issue stop command.
        this.postCommand('pauseexp', (new Date()).getTime());
    }
    terminateExp(e) {
        this.setState({
            showTermModal: true
        });
        this.postCommand('terminateexp',(new Date()).getTime());       
    }
    onClickStart(e){
        // Create a new experiment entry and new plots for each of the nodes.
        var agcPlots = {};
        
        Object.keys(this.props.nodeList).map( (nodeName,index) =>{
            // Add a new agc plot to each MZNT node that is online.
            if(this.props.nodeList[nodeName].status === 'online'){
                console.log("Setting node stream key "+nodeName);
                var agcStream = firebase.db.ref('/agcdata').push();
                agcPlots[nodeName] = agcStream.key;    
                firebase.db.ref('state/nodes/'+nodeName).update({
                    'streamKey': agcStream.key
                });         
            }   
            return true;
        });

        // Tell the nodes to start logging.        
        this.postCommand('startexp', this.props.expData.expname);

        // Update the new experiment ref.
        firebase.db.ref('/expinfo_a/'+this.props.expKey).update({
            'agcplots': agcPlots,
            'start_time': (new Date()).getTime()
        });       

        // Update the current experiment.
        this.updateExpStatus("ARMED");
    }

    //---------------- CONTROL COMMANDS ------------------------------------
    onClickSpec(e){
        // Change the state.
        this.postCommand('getspec', (new Date()).getTime());
    }

    //-------------------- FORM CHANGE HANDLING ---------------------------
    handleChangeAGCT(event){
        this.setState({ agcThreshChange: event.target.value });
    }
    handleChangeAGCNom(event){
        this.setState({ nominalAGCChange: event.target.value });
    }
    onUpdateAGCT(event){
        if(!isNaN(this.state.agcThreshChange)){
            firebase.db.ref("expinfo_a/"+this.props.expKey+"/settings").update({
                'agcThresh': this.state.agcThreshChange
            });
        } else {
            console.log("AGC Threshold not a number.");
        }
    }
    onUpdateAGCN(event){
        if(!isNaN(this.state.nominalAGCChange)){
            firebase.db.ref("expinfo_a/"+this.props.expKey+"/settings").update({
                'nomAGC': this.state.nominalAGCChange
            });
        } else {
            console.log("AGC Threshold not a number.");
        }
    }
    //-----------------------------------------------------------------------
    getLocationPos() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( (pos) => {
                //You have your locaton here
                console.log("Latitude: " + pos.coords.latitude +" Longitude: " + pos.coords.longitude);
               
                return true;
            });
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
    }

    addLocationJam() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( (pos) => {
                //You have your locaton here
                console.log("Latitude: " + pos.coords.latitude +" Longitude: " + pos.coords.longitude);               
                return true;
            });
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
    }

    render() {
        return (
        <div>
            <Grid fluid={true}>
                <Row>
                    <Col xs={6}>
                        <Button bsStyle="primary" onClick={this.onClickUpdate.bind(this)} disabled={!(this.props.controlState==="ARMED")} >Get Assisted Position Update</Button>
                        <Button bsStyle="primary" onClick={this.onClickEphemeris.bind(this)} disabled={!(this.props.controlState==="ARMED"||this.props.controlState==="STARTED")}>Get Ephemeris Update</Button>
                        <Button bsStyle="primary" onClick={this.onClickStart.bind(this)} disabled={!(this.props.controlState==="SETUP")}>Start Experiment</Button>
                        <Button bsStyle="primary" onClick={this.onClickStopExp.bind(this)} disabled={(this.props.controlState==="SETUP")}>Pause Experiment</Button>
                        <Button bsStyle="primary" onClick={this.onClickSpec.bind(this)} disabled={false}>Get Spectrum Plots</Button>                                             
                    </Col>
                    <Col xs={6}>
                        <Form>
                            <FormGroup controlId="agcThreshControl">
                                <ControlLabel>AGC Threshold Setting: {this.state.agcThresh} </ControlLabel>
                                <FormControl type="text" value={this.state.agcThreshChange} onChange={this.handleChangeAGCT.bind(this)} />
                                <Button bsStyle="danger" onClick={this.onUpdateAGCT.bind(this)}>Update</Button>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>AGC Nominal Setting: {this.state.nominalAGC} </ControlLabel>
                                <FormControl type="text" value={this.state.nominalAGCChange} onChange={this.handleChangeAGCNom.bind(this)} />
                                <Button bsStyle="danger" onClick={this.onUpdateAGCN.bind(this)}>Update AGC Nominal Value</Button>
                            </FormGroup>
                        </Form>
                    </Col>
                    <Col xs={6}>
                        <Button bsStyle="primary" onClick={this.getLocationPos.bind(this)}>GetPosition</Button>
                        <Button bsStyle="primary" disabled={!this.state.jamButtonActive} onClick={this.addLocationJam.bind(this)}>Mark Jammer</Button>
                    </Col>
                    <Col xs={6}>
                        <Button bsStyle="danger" onClick={()=>(this.setState({showRebootModal:true}))}>Remote Reboot Nodes</Button>
                        <Button bsStyle="danger" onClick={this.terminateExp.bind(this)}>TerminateExperiment</Button>
                    </Col>
                </Row>
            </Grid>
            <Modal show={this.state.showTermModal}>
                <Modal.Header>
                    <Modal.Title>Experiment Terminated</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Experiment has been termianted.
                </Modal.Body>
                <Modal.Footer>
                    <Link to="/experiments"> <Button>OK</Button> </Link>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.showEphModal} onHide={this.onClickHideEphModal.bind(this)}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup>
                            {
                                Object.keys(this.props.nodeList).map( (nodeName, index) => (
                                    <Radio value={nodeName} name="ephGroup" key={index} onChange={this.onRadioChange.bind(this)}>{nodeName}</Radio>
                                ))
                            }
                        </FormGroup>
                        <FormGroup>
                            <Checkbox>GPS_L1</Checkbox>
                            <Button bsStyle="primary" onClick={this.onClickEphStart.bind(this)} >START</Button>
                        </FormGroup>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={(this.state.showRebootModal)} onHide={()=>(this.setState({showRebootModal:false}))}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup>
                            {
                                Object.keys(this.props.nodeList).map( (nodeName, index) => (
                                    <Radio value={nodeName} name="rebootGroup" key={index} onChange={ (event)=>(this.setState({rebootNodeName:event.target.value})) }>{nodeName}</Radio>
                                ))
                            }
                        </FormGroup>
                        <p>Selected Node Name: {this.state.rebootNodeName}</p>
                        <FormGroup>
                            <Button bsStyle="warning" onClick={this.onClickRebootNode.bind(this)}>Send Reboot Command</Button>
                        </FormGroup>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
        );
    }
}
export default ControlBlock;