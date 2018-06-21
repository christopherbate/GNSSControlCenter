import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import withAuthorization from './HOCs/withAuthorization';
import { firebase } from '../firebase/index';

class SystemInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
    }
    componentWillMount(){
        firebase.db.ref('/messages').orderByChild('time').limitToLast(50).on('child_added', (snap) =>{
            return this.setState( function(prevState,props) {
                prevState.messages.unshift({
                    time: snap.val().time,
                    text: snap.val().text
                });
                return {                    
                    messages: prevState.messages
                };
            });
        });
    }
    componentWillUnmount(){
        firebase.db.ref('/messages').off();
    }
    render() {
        const timeOpt = {timeZone: 'America/Denver',hour:'numeric',minute:'numeric', hour12: false, day:'numeric',month:'numeric', second:'numeric'};
        const tickFormatter = (tick) => (new Date(tick)).toLocaleString('en-US',timeOpt);
        return (
            <div>
                <br />
                <Table striped condensed>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.messages.map( (msg, index)  => (
                                <tr key={index}>
                                    <td>{tickFormatter(msg.time)}</td>
                                    <td>{msg.text}</td>                            
                                </tr>
                            ))
                        }
                    </tbody>                
                </Table>
            </div>
        );
    }
}


/// asdf

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(SystemInfo);