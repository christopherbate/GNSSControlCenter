import React, {Component} from 'react';
import withNodeInfo from './withNodeInfo';
import {Grid, Row, Col, Panel, Button} from 'react-bootstrap';

class NodeControl extends Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12} md={6}>
                        <Panel>
                            <Panel.Heading>               
                                Node Messages : {this.props.match.params.id}            
                            </Panel.Heading>
                            <Panel.Body>
                            </Panel.Body>                                                                                                                        
                        </Panel>
                    </Col>
                    <Col xs={12} md={6}>
                        <Panel>
                            <Button>Reboot MZNTLogger</Button>
                            <Button>Reboot Node</Button>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        )
    }
}


export default withNodeInfo(NodeControl);