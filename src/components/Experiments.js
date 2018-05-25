import React, { Component } from 'react';
import { Table, Button, Label, Tab, Tabs } from 'react-bootstrap';
import { firebase } from '../firebase/index';
import NewExpForm from './NewExpForm';
import {Link} from 'react-router-dom';
import withAuthorization from './withAuthorization';
import withNodeInfo from './withNodeInfo';

class Experiments extends Component {

    constructor(props) {
        super(props);
        this.expList = {}
        this.state = {
            expList: {},
            activeKey: 1,
            time: (new Date()).getTime(),
            terminatedShow: false
        };
        this.expData = '/expinfo_a';
    }

    componentWillMount() {
        firebase.db.ref(this.expData).on('child_added', (snapshot) => {
            this.expList[snapshot.key] = snapshot.val();
            return this.setState({ expList: this.expList });
        });
        firebase.db.ref(this.expData).on('child_removed', (snapshot) => {
            if (!snapshot) { return; }
            delete this.expList[snapshot.key];
            return this.setState({ expList: this.expList });
        });

        firebase.db.ref(this.expData).on('child_changed', (snapshot) => {
            this.expList[snapshot.key] = snapshot.val();
            return this.setState({ expList: this.expList });
        });

        this.timerID = setInterval( ()=>(this.setState({time: (new Date).getTime()})), 1000 );
    }

    componentWillUnmount() {
        firebase.db.ref(this.expData).off();
        clearInterval(this.timerID);
    }

    render() {
        return (
        <div>
            <Tabs activeKey={this.state.activeKey} onSelect={(key) => { this.setState({ activeKey: key }) }} id="controlled-tab" >
                <Tab title="Current Experiments" eventKey={1} >
                    <br />
                    <Table striped bordered condensed hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Nodes</th>
                                <th>Status</th>
                                <th>Run Time</th>
                                <th>Owner</th>
                                <th></th>                                                                                
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(this.state.expList).map((expKey, index) => (
                                    <tr key={index}>
                                        <td>
                                            {
                                                this.state.expList[expKey].expname
                                            }
                                        </td>
                                        <td>
                                            {
                                                Object.keys(this.state.expList[expKey].nodes).map( (nodeName,index) => (
                                                    <p key={index}>{nodeName}</p>
                                                ))
                                            }
                                        </td>
                                        <td>
                                            {
                                                this.state.expList[expKey].status === 'offline' ?
                                                    (<Label bsStyle="danger">{this.state.expList[expKey].status}</Label>)
                                                    : (<Label bsStyle="success">{this.state.expList[expKey].status}</Label>)
                                            }
                                        </td>
                                        <td>
                                            {
                                                (this.state.time - this.state.expList[expKey].start_time)/1000
                                            }
                                        </td>
                                        <td>
                                            {
                                                this.state.expList[expKey].owner
                                            }
                                        </td>      
                                        <td>
                                            <Link to={"/experiments/"+expKey}><Button>ControlPage</Button></Link>
                                        </td>                              
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey={2} title="New Experiment">
                    <br />
                    <NewExpForm nodeList={this.props.nodeList} />
                </Tab>
            </Tabs>
            
        </div>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withNodeInfo(Experiments));