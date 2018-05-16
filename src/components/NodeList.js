import React, { Component } from 'react';
import {Table} from 'react-bootstrap';

class NodeList extends Component {
    render() {
        return (
        <div>
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th># Errors</th>                    
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(this.props.nodeList).map((nodeName,index) => (
                            <tr key={index}>
                                <td>{nodeName}</td>
                                <td>MZNT</td>
                                <td>{this.props.nodeList[nodeName].status}</td>
                                <td>{this.props.nodeList[nodeName].errcount}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
        );
    }
}
export default NodeList;