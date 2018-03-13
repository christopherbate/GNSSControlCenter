
import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import {firebase} from '../firebase/index';

class MessageBlock extends Component {

  constructor(props){
      super(props);
      this.messages=[];
      this.state = {
          messages: []
      };
  }

  componentWillMount(){
      let messageRef = firebase.db.ref('/messages').orderByKey().limitToLast(100);
      messageRef.on('child_added', (snapshot) => {
          console.log(snapshot.val());
          let message = {text: snapshot.val().text, id: snapshot.key};
          this.messages.push(message);
          this.setState( {messages: this.messages } );
      } );
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