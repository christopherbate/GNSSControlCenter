import React, { Component } from 'react';
import { firebase } from '../firebase/index';

class MessageBlock extends Component {

    constructor(props) {
        super(props);
        this.messages = {};
        this.state = {
            messages: this.messages
        };
    }

    componentWillMount() {
        var messageRef = firebase.db.ref('/messages').orderByKey().limitToLast(100);
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