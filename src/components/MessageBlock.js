import React, { Component } from 'react';
import { firebase } from '../firebase/index';

class MessageBlock extends Component {

    constructor(props) {
        super(props);
        this.messages = {};
        this.state = {
            messages: this.messages
        };
        this.dataLoc = '';
    }

    componentWillMount() {
        var messageRef;
        if(this.props.dataLoc) {
            messageRef = firebase.db.ref(this.props.dataLoc).orderByKey().limitToLast(100);
            this.dataLoc = this.props.dataLoc;
        } else {
            messageRef = firebase.db.ref('/messages').orderByKey().limitToLast(100);
            this.dataLoc = '/messages';
        }            
        messageRef.on('child_added', (snapshot) => {
            this.messages[snapshot.key] = snapshot.val();
            this.setState({ messages: this.messages });
            return true;
        });
        messageRef.on('child_removed', (snapshot) => {
            if (snapshot.key !== null) {
                delete this.messages[snapshot.key];
            }
            this.setState({ messages: this.messages });
            return true;
        });
    }

    componentWillUnmount() {
        firebase.db.ref(this.dataLoc).off();
    }

    render() {
        return (
            <div>
                <ul>
                    {
                        Object.keys(this.state.messages).map((key, index) => (
                            <li key={index}>
                                {this.state.messages[key].text}
                            </li>))
                    }
                </ul>
            </div>
        );
    }
}
export default MessageBlock;