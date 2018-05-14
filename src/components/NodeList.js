import React, { Component } from 'react';

class NodeList extends Component {
    render() {
        return (
        <div>
            <ul>
            {
                Object.keys(this.props.nodeList).map( (name,i) => (
                        <li key={i}>
                            {name} - {this.props.nodeList[name].status}
                        </li>))
            }
            </ul>
        </div>
        );
    }
}
export default NodeList;