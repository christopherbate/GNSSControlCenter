import React, { Component } from 'react';
import {Table, Label} from 'react-bootstrap';

class NodeList extends Component {
    render() {
        return (
        <div>
            <Table striped bordered condensed hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th># Errors</th>         
                        <th>App Version</th>
                        <th>OS Version</th>           
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(this.props.nodeList).map((nodeName,index) => (
                            <tr key={index}>
                                <td>{nodeName}</td>
                                <td>MZNT</td>
                                <td>
                                    { 
                                        this.props.nodeList[nodeName].status === 'offline' ? 
                                        (<Label bsStyle="danger">{this.props.nodeList[nodeName].status}</Label>) 
                                        : (<Label bsStyle="success">{this.props.nodeList[nodeName].status}</Label>)
                                    }
                                </td>
                                <td> 
                                    { 
                                        this.props.nodeList[nodeName].errcnt !== 0 ? 
                                        (<Label bsStyle="danger">{this.props.nodeList[nodeName].errcnt}</Label>) 
                                        : (<Label bsStyle="success">{this.props.nodeList[nodeName].errcnt}</Label>)
                                    }
                                </td>
                                <td>
                                    v0.5
                                </td>
                                <td>
                                    PL2018.1
                                </td>
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