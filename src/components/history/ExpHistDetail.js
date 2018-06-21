import React, { Component } from 'react';
import { Grid, Row, Panel } from 'react-bootstrap';
import AGCHistPlots from '../charts/AGCHistPlots';
import { withExpInfoHist } from '../HOCs/withExpInfo';

class ExpHistDetail extends Component {
    render() {
        return (
            <div>
                <Grid>
                    <Row>
                        <Panel>
                            <Panel.Heading>
                                Experiment Info
                            </Panel.Heading>
                            <Panel.Body>
                                {
                                    this.props.expData ?
                                        (<h3>Name: {this.props.expData.expname}</h3>) :
                                        null
                                }
                            </Panel.Body>
                        </Panel>
                    </Row>
                    <Row>
                        {
                            this.props.expData ?
                                (<AGCHistPlots dataLimit={-1} nodeList={this.props.expData.agcplots} />) :
                                null
                        }
                    </Row>
                    <Row>
                        <Panel>
                            <Panel.Heading>
                                Jammer Locations
                            </Panel.Heading>
                            <Panel.Body>

                            </Panel.Body>
                        </Panel>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default withExpInfoHist(ExpHistDetail);