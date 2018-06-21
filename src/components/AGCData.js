import React, { Component } from 'react';
import { Table, ProgressBar, Label, Button, Image } from 'react-bootstrap'
import { firebase } from '../firebase/index';
class AGCData extends Component {
    postCommand(type, value) {
        firebase.db.ref("/command").push().set({
            'type': type,
            'value': value,
        });
    }

    requestAGC(nodeName) {
        this.postCommand("getagc", nodeName);
    }

    resetUploadProgress(nodeName){
        firebase.db.ref('/state/nodes/'+nodeName).update({
            'agc_upload_progress': 0
        });
    }

    render() {
        const timeOpt = { timeZone: 'America/Denver', hour: 'numeric', minute: 'numeric', hour12: false, day: 'numeric', month: 'numeric', second: 'numeric' };
        const tickFormatter = (tick) => (new Date(tick)).toLocaleString('en-US', timeOpt);
        return (
            <Table condensed striped hover bordered>
                <thead>
                    <tr>
                        <th>Node</th>
                        <th>Last AGC Upload Timestamp</th>
                        <th>Current Upload Progress</th>
                        <th>Link</th>
                        <th></th>
                        <th>Plot</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !!this.props.nodeList ?
                            Object.keys(this.props.nodeList).map((nodeName, index) => {
                                return (
                                    this.props.nodeList[nodeName].status === "online" ?
                                        (<tr key={index}>
                                            <td>{nodeName}</td>
                                            <td>{
                                                !!this.props.nodeList[nodeName].agc_upload_timestamp ?
                                                    (<Label bsStyle="success">{this.props.nodeList[nodeName].agc_upload_timestamp}</Label>) :
                                                    (<Label bsStyle="warning">No upload</Label>)
                                            }</td>
                                            <td> {
                                                !!this.props.nodeList[nodeName].agc_upload_progress ?
                                                    (<ProgressBar now={this.props.nodeList[nodeName].agc_upload_progress} />) :
                                                    (<Label bsStyle="warning">No Data</Label>)
                                            }
                                            <Button onClick={ () => (this.resetUploadProgress(nodeName))}>Reset</Button>
                                            </td>
                                            <td>
                                                {
                                                    !!this.props.nodeList[nodeName].agc_upload_link ?
                                                        (<a href={this.props.nodeList[nodeName].agc_upload_link}>Download</a>) :
                                                        null
                                                }
                                            </td>
                                            <td>
                                                <Button onClick={() => (this.postCommand("getagc", nodeName))} >Upload</Button>
                                            </td>
                                            <td>
                                                {
                                                    !!this.props.nodeList[nodeName].agc_upload_plot_url ?
                                                    <Image src={this.props.nodeList[nodeName].agc_upload_plot_url} responsive /> :
                                                    null
                                                }
                                            </td>
                                        </tr>
                                        ) : null
                                )
                            }) : null
                    }
                </tbody>
            </Table>
        );
    }
}

export default AGCData;