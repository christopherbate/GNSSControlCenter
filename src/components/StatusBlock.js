import React, { Component } from 'react';
import {firebase} from '../firebase/index';
import {Label} from 'react-bootstrap';

class StatusBlock extends Component {
    render() {
        return (
        <div>
           <p>System Status: {this.props.status}</p>
           <p>Eph Stamp:{
                ( (new Date()).getTime()-(new Date(this.props.eph)) < 2*60*60*1000) ? 
                (<Label bsStyle="success">{this.props.eph}</Label>):
                (<Label bsStyle="danger">{this.props.eph}</Label>)
           } </p>
        </div>
        );
    }
}
export default StatusBlock;