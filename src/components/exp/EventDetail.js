import React, {Component} from 'react';
import {Table, ProgressBar} from 'react-bootstrap';

class EventDetail extends Component {
    render() {
        return (
            <Table condensed striped bordered hover> 
                <thead>
                    <tr>
                        <th>Node Name</th>
                        <th>UploadStatus - AGC </th>
                        <th>UploadStatus - IF </th>
                    </tr>
                </thead>
            
                <tbody>
                    {
                        this.props.eventData && this.props.eventData.nodes ? 
                        Object.keys(this.props.eventData.nodes).map( (nodeName,index) => (
                            <tr>
                                <td>{nodeName}</td>
                                <td>{this.props.eventData.nodes[nodeName].datarecv ? <p>OK</p> : <p>Waiting</p>}</td>
                                <td><ProgressBar now={(this.props.eventData.nodes[nodeName].ifupload/35000000)*100} /></td>
                            </tr>
                        )) : null                        
                    }
                </tbody>
            </Table>
        );
    }
}

export default EventDetail;