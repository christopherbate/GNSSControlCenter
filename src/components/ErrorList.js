import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
class ErrorList extends Component {
    render() {
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
                                <td></td>
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