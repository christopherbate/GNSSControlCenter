import React, { Component } from 'react';
import {firebase} from '../firebase/index';

class StatusBlock extends Component {

    constructor(props){
        super(props);
        this.info = {
            status: 'OFFLINE',
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
                this.info = {status: snapshot.val().status, num_nodes: snapshot.val().num_nodes};
                this.setState( {info: this.info } );
            }
        } );
    }

    render() {
        return (
        <div>
           <p>System Status: {this.state.info.status}</p>
        </div>
        );
    }
}
export default StatusBlock;