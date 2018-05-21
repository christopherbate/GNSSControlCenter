import React, { Component } from 'react';
import {firebase} from '../firebase/index';
import {Label} from 'react-bootstrap';

class StatusBlock extends Component {

    constructor(props){
        super(props);
        this.info = {
            status: 'OFFLINE',
            eph: 0,
            nodes: 0
        };
        this.state = {
            info: this.info
        };
    }

    componentWillMount(){
        let messageRef = firebase.db.ref('/state');
        messageRef.on('value', (snapshot) => {
            console.log(snapshot.val());
            if(!!snapshot.val()) {
                this.info = {status: snapshot.val().status, eph: snapshot.val().ephTime };
                this.setState( {info: this.info } );
            }
        } );
    }

    render() {
        return (
        <div>
           <p>System Status: {this.state.info.status}</p>
           <p>Eph Stamp:{
                (((new Date(this.state.info.eph)) - (new Date()).getTime()) < 2*60*60*1000) ? 
                (<Label bsStyle="success">{this.state.info.eph}</Label>):
                (<Label bsStyle="danger">{this.state.info.eph}</Label>)
           } </p>
        </div>
        );
    }
}
export default StatusBlock;