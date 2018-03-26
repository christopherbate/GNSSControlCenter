import React, { Component } from 'react';
import {firebase} from '../firebase/index';
import {Button} from 'react-bootstrap';
class ControlBlock extends Component {

    constructor(props){
        super(props);
        this.state = {
            buttonPressed: null
        };
    }

    componentWillMount(){
        
    }

    render() {
        return (
        <div>
           <Button bsStyle="primary">Start Experiment</Button>
        </div>
        );
    }
}
export default ControlBlock;