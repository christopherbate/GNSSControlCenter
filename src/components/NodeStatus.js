import React, { Component } from 'react';
import { Grid, Table, Row, Col, Label,ProgressBar } from 'react-bootstrap';
import withNodeInfo from './withNodeInfo';
import withAuthorization from './withAuthorization';

class NodeStatus extends Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <div>
                            <Table striped bordered condensed hover responsive>
                                <thead>
                                    <tr>
                                        <th>Node</th>
                                        <th>Status</th>
                                        <th>Type</th>
                                        <th>Owner</th>
                                        <th>Exp.</th>
                                        <th>Uptime</th>
                                        <th>Errors</th>
                                        <th>Free Space</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(this.props.nodeList).map((nodeName, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {nodeName}
                                                </td>
                                                <td>
                                                    {
                                                        this.props.nodeList[nodeName].status === 'offline' ?
                                                            (<Label bsStyle="danger">{this.props.nodeList[nodeName].status}</Label>)
                                                            : (<Label bsStyle="success">{this.props.nodeList[nodeName].status}</Label>)
                                                    }
                                                </td>
                                                <td>
                                                </td>
                                                <td>
                                                </td>
                                                <td>
                                                </td>
                                                <td>
                                                </td>
                                                <td>
                                                    {
                                                        this.props.nodeList[nodeName].errcnt !== 0 ?
                                                            (<Label bsStyle="danger">{this.props.nodeList[nodeName].errcnt}</Label>)
                                                            : (<Label bsStyle="success">{this.props.nodeList[nodeName].errcnt}</Label>)
                                                    }
                                                </td>
                                                <td>
                                                    <ProgressBar now={60} />
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withNodeInfo(NodeStatus));