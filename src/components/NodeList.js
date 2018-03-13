import React, { Component } from 'react';
import {firebase} from '../firebase/index';

class NodeList extends Component {

    constructor(props){
        super(props);
        this.nodeList = [];
        this.state = {
            nodeList: []
        };
    }

    removeNodeByKey(key){
        if(!this.nodeList){
            return;
        }
        let i,len = this.nodeList.length;

        for(i=0; i < len; i++){
          if(this.nodeList[i].id === key){
              this.nodeList.splice(i,1);
          }
      }
    }

    updateNodeByKey(key,name,status){
        if(!this.nodeList){
            return;
        }

        let i,len = this.nodeList.length;
        for(i=0; i < len; i++){
          if(this.nodeList[i].id === key){
              this.nodeList[i].name = name;
              this.nodeList[i].status = status;
          }
      }
    }

    componentWillMount(){
        let messageRef = firebase.db.ref('/nodes').orderByKey().limitToLast(10);
        messageRef.on('child_added', (snapshot) => {
            let node = {name: snapshot.val().name, id: snapshot.key, status: snapshot.val().status};
            this.nodeList.push(node);
            this.setState( {nodeList: this.nodeList } );
        } );

        messageRef.on('child_removed', (snapshot) => {
            this.removeNodeByKey(snapshot.key);
            this.setState( {nodeList: this.nodeList} );
        })

        messageRef.on('child_changed', (snapshot) => {
            this.updateNodeByKey(snapshot.key,snapshot.val().name,snapshot.val().status);
            this.setState({nodeList: this.nodeList});
        })
    }

    render() {
        return (
        <div>
            <ul>
            {
                this.state.nodeList.map( (node) => (
                        <li key={node.id}>
                            {node.name} - {node.status}
                        </li>))
            }
            </ul>
        </div>
        );
    }
}
export default NodeList;