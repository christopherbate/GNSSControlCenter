import React, { Component } from 'react';

class NodeList extends Component {
    render() {
        return (
        <div>
            <ul>
            {
                this.props.nodeList.map( (node) => (
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