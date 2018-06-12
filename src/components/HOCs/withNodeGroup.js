import React from 'react';
import PropTypes from 'prop-types';

import {firebase} from '../firebase/index';

const withNodeGroup = (keyListLoc) => (Component) => {
    class WithNodeGroup extends React.Component {
        constructor(props) {
            super(props);
            this.nodeGroupData = {};
            this.state = {
                nodeGroupData: {}
            }
            this.subscribeToNode.bind(this);
        }
        subscribeToNode(key) {
            firebase.db.ref('/state/nodes/'+key).on( 'value', (snapshot) => {
                this.nodeGroupData[snapshot.ref.key] = snapshot.val()
                this.setState({
                    nodeGroupData: this.nodeGroupData
                });
            });
        }
        unsubscribeToNodes() {
            Object.keys(this.nodeGroupData).map((key,index) => {
                firebase.db.ref('/state/nodes/'+key).off();
            })            
        }
        componentWillMount() {
            firebase.db.ref(keyListLoc).once('value', (snapshot) => {
                snapshot.forEach( (item) => {
                    this.subscribeToNode(item.ref.key);
                });
            });
        }
        componentWillUnmount() {
            this.unsubscribeToNodes();
        }
        render() {
            return <Component nodeGroupData={this.state.nodeGroupData} match={this.props.match} />;
        }
    }

    return WithNodeGroup;
}

export default withNodeGroup;