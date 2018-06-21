import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
class ErrorList extends Component {
    render() {
        const timeOpt = {timeZone: 'America/Denver',hour:'numeric',minute:'numeric', hour12: false, month:'numeric', day:'numeric'};
        return (
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(this.props.errorList).map((key, index) => (
                            <tr key={index}>
                                <td>{(new Date(this.props.errorList[key].time)).toLocaleString('en-US',timeOpt) }</td>
                                <td>{this.props.errorList[key].msg}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        );
    }
}

export default ErrorList;