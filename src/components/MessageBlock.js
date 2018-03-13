import React, { Component } from 'react';
import {firebase} from '../firebase/index';

class MessageBlock extends Component {

    constructor(props){
        super(props);
        this.messages=[];
        this.state = {
            messages: []
        };
        this.removeMsgByKey.bind(this);
    }

    removeMsgByKey(key){
        let i,len = this.messages.length;
        //console.log(this.messages);
        for(i=0; i < len; i++){
            if(this.messages[i].id === key){
                this.messages.splice(i,1);
            }
        }
    }

    updateMsgByKey(key,value){
        let i,len = this.messages.length;
        //console.log(this.messages);
        for(i=0; i < len; i++){
            if(this.messages[i].id === key){
                this.messages[i].text = value;
            }
        }
    }

    componentWillMount(){
        var messageRef = firebase.db.ref('/messages').orderByKey().limitToLast(100);
        messageRef.on('child_added', (snapshot) => {
            var msgVal = snapshot.val();                        
            this.messages.push({text: msgVal.text, id: snapshot.key});
            this.setState( {messages: this.messages } );
        } );

        messageRef.on('child_removed', (snapshot) => {
            this.removeMsgByKey(snapshot.key);
            this.setState( {messages: this.messages} );
        });

        messageRef.on('child_changed', (snapshot) => {            
            this.updateMsgByKey(snapshot.key, snapshot.val().text);
            this.setState({messages: this.messages});
        });
    }

    render() {
        return (
        <div>
        <ul>
        {
            this.state.messages.map( (message) => (
                    <li key={message.id}>
                        {message.text}
                    </li>))
        }
        </ul>
        </div>
        );
    }
}
export default MessageBlock;