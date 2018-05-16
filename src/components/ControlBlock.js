import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import {firebase} from '../firebase/index';
import {Grid, Row, Col, Modal, Radio} from 'react-bootstrap';
import {FormGroup,Checkbox,FormControl,ControlLabel, Form} from 'react-bootstrap';
class ControlBlock extends Component {

    constructor(props){
        super(props);
        this.state = {
            buttonPressed: null,
            showExpSetup: false,
            showEphModal: false,
            ephNodeName: "mz0",
            agcThresh: 0,
            agcThreshChange: 0,
            nominalAGC: 0,
            nominalAGCChange: 0,
            expSetupName: "Enter Name"
        };
    }

    componentWillMount(){
        firebase.db.ref("/settings/agcThresh").on("value", (snap) => ( this.setState({agcThresh: snap.val()}) ));
        firebase.db.ref("/settings/nomAGC").on("value", snap => ( this.setState({nominalAGC: snap.val()}) ));
    }

    onClickUpdate(e) {
        var ts = Math.round((new Date()).getTime() / 1000);
        firebase.db.ref("/command").update( {
            'update': ts
        });
    }

    onClickHideExpSetup(){
        this.setState({showExpSetup:false});
    }

    onClickHideEphModal(){
        this.setState({showEphModal:false});
    }

    onClickEphemeris(e) {
        this.setState({showEphModal: true});
    }

    onClickEphStart(e) {
        this.setState({showEphModal: false});
        firebase.db.ref("/command").update({
            'get_eph': this.state.ephNodeName
        });
        console.log("Getting eph from " + this.state.ephNodeName);
    }

    onClickStartExp(e) {
        this.setState( {showExpSetup:true} );
    }
    onClickStopExp(e) {
        // Change the state and the experiment key.
        firebase.db.ref('state').update({
            'status':'SETUP',
            'expkey': null
        });

        // Clear the individual node plot data.
        Object.keys(this.props.nodeList).map( (nodeName,index) =>{
            firebase.db.ref('state/nodes/'+nodeName).update({
                'streamKey': null,
                'specKey': null
            });
            return true;
        });
    }
    onClickExpModalStart(e){
        // This is for starting experiment.
        // Hide the modal.
        this.setState( {showExpSetup: false});
        
        // Create new time.
        var ts = Math.round((new Date()).getTime()/1000);

        // Create new plots for each of the nodes.
        var agcPlots = {};
        var expRef = firebase.db.ref('/expinfo/').push();
        Object.keys(this.props.nodeList).map( (nodeName,index) =>{
            // Add a new agc plot
            if(this.props.nodeList[nodeName].status === 'online'){
                var agcStream = firebase.db.ref('/agcdata').push();
                agcPlots[nodeName] = agcStream.key;    
                firebase.db.ref('state/nodes/'+nodeName).update({
                    'streamKey': agcStream.key
                });         
            }   
            return true;
        });

        // Tell the nodes to start logging.
        firebase.db.ref('/command').update({
            'startexp': this.state.expSetupName
        });

        // Update the new experiment ref.
        expRef.update({
            'agcplots': agcPlots,
            'expname': this.state.expSetupName,
            'start_time': ts
        });       

        // Update the current experiment.
        firebase.db.ref('/state').update({
            'expkey': expRef.key,
            'status': 'STARTED'            
        });
    }

    //---------------- CONTROL COMMANDS ------------------------------------
    onClickRebootAll(e){        
        firebase.db.ref("/command").update({
            'rebootall': new Date()
        });
    }
    onClickHaltAll(e) {
        firebase.db.ref("/command").update({
            'haltall': new Date()
        });
    }
    onClickSpec(e){
        // Change the state.
        firebase.db.ref('/state').update({
            status: "SPECREQUESTED"
        });
        // Tell the server we requested a spec.
        firebase.db.ref("/command").update({
            'getspec': new Date()
        });
    }

    //-------------------- FORM CHANGE HANDLING ---------------------------
    onRadioChange(event){
        console.log(event.target.value);
        this.setState({ephNodeName:event.target.value});
    }
    handleChangeAGCT(event){
        this.setState({ agcThreshChange: event.target.value });
    }
    handleChangeAGCNom(event){
        this.setState({ nominalAGCChange: event.target.value });
    }
    handleExpSetupName(event){
        this.setState({expSetupName: event.target.value});
    }
    onUpdateAGCT(event){
        if(!isNaN(this.state.agcThreshChange)){
            firebase.db.ref("/settings").update({
                'agcThresh': this.state.agcThreshChange
            });
        } else {
            console.log("AGC Threshold not a number.");
        }
    }
    onUpdateAGCN(event){
        if(!isNaN(this.state.nominalAGCChange)){
            firebase.db.ref("/settings").update({
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
                firebase.db.ref("/markers").push().set({
                    'long': pos.coords.longitude,
                    'lat':pos.coords.latitude,
                    'name': "M"
                });
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
                firebase.db.ref('/settings/expkey').once('value', (snap)=>{
                    firebase.db.ref("/markers").push().set({
                        'long': pos.coords.longitude,
                        'lat':pos.coords.latitude,
                        'name': "INT"
                    });
                    firebase.db.ref("/expinfo/"+snap.val()+"/int").push().set({
                        'long': pos.coords.longitude,
                        'lat':pos.coords.latitude,
                        'name': "INT",
                        'time': Math.round((new Date()).getTime()/1000)
                    });
                });
                
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
                        <Button bsStyle="primary" onClick={this.onClickEphemeris.bind(this)} disabled={!(this.props.controlState==="ARMED"||this.props.controlState==="SETUP")}>Get Ephemeris Update</Button>
                        <Button bsStyle="primary" onClick={this.onClickStartExp.bind(this)} disabled={!(this.props.controlState==="SETUP")}>Start Experiment</Button>
                        <Button bsStyle="primary" onClick={this.onClickStopExp.bind(this)} disabled={!(this.props.controlState==="ARMED"||this.props.controlState==="STARTED")}>Stop Experiment</Button>
                        <Button bsStyle="primary" onClick={this.onClickSpec.bind(this)} disabled={!(this.props.controlState==="ARMED"||this.props.controlState==="STARTED")}>Get Spectrum Plots</Button>                                             
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
                        <Button bsStyle="danger" onClick={this.onClickRebootAll.bind(this)}>Remote Reboot Nodes</Button>
                        <Button bsStyle="danger" onClick={this.onClickHaltAll.bind(this)}> Halt all </Button>
                    </Col>
                </Row>
            </Grid>

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

            <Modal show={this.state.showExpSetup} onHide={this.onClickHideExpSetup.bind(this)}>
                <Modal.Header closeButton>Experiment Setup</Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup>
                            <ControlLabel>Experiment Name</ControlLabel>
                            <FormControl type="text" value={this.state.expSetupName} onChange={this.handleExpSetupName.bind(this)} />
                            <Button bsStyle="primary" onClick={this.onClickExpModalStart.bind(this)}>Start</Button>
                        </FormGroup>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
        );
    }
}
export default ControlBlock;