import React from 'react';
import {firebase} from '../firebase/index';

const withExpInfo = (Component) => {
    class WithExpInfo extends React.Component {
        constructor(props) {
            super(props);
            this.expData = {};
            this.nodeGroupData = {};
            this.state = {
                expData: null,
                nodeGroupData: {}
            };
            this.expLoc = '/expinfo_a/'+this.props.match.params.id;
            this.subscribeToNode.bind(this);
        }
        subscribeToNode(key) {
            firebase.db.ref('/state/nodes/'+key).on( 'value', (snapshot) => {
                if(snapshot){
                    this.nodeGroupData[snapshot.ref.key] = snapshot.val()
                    this.setState({
                        nodeGroupData: this.nodeGroupData
                    });
                }
            });
        }
        unsubscribeToNodes() {
            Object.keys(this.nodeGroupData).map((key,index) => (
                firebase.db.ref('/state/nodes/'+key).off()
            ));            
        }
        componentWillMount() {
            firebase.db.ref('/expinfo_a/'+this.props.match.params.id).on('value', (snapshot) => {
                this.setState({
                    expData: snapshot.val()
                });
            });

            this.keyListLoc = '/expinfo_a/'+this.props.match.params.id+'/nodes';
            firebase.db.ref(this.keyListLoc).once('value', (snapshot) => {
                snapshot.forEach( (item) => {
                    console.log("Subscribing to node: " + item.ref.key);
                    this.subscribeToNode(item.ref.key);
                });
            });
        }
        componentWillUnmount() {
            firebase.db.ref('/expinfo_a/'+this.props.match.params.id).off();
            this.unsubscribeToNodes();
        }
        render() {
            return <Component expData={this.state.expData} nodeGroupData={this.state.nodeGroupData} match={this.props.match} />;
        }
    }

   
    return WithExpInfo;
}

export default withExpInfo;