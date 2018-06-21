import React from 'react';
import { Grid, Panel, Row, Col, Image } from 'react-bootstrap';
import { firebase } from '../../firebase/index';

import AGCChart_rechart from './AGCChart_rechart';

class SpecPlot extends React.Component {
    constructor(props) {
        super(props);
        this.downloadURL = null
        this.state = {
            downloadUrl: null
        };
    }
    componentWillMount() {
        if (this.props.gsloc) {
            console.log("Downloading URL");
            firebase.storage.ref(this.props.gsloc).getDownloadURL().then((url) => {
                this.downloadURL = url;
                this.setState({ downloadUrl: this.downloadURL });
            });
        }
    }
    render() {
        return (
            <Image src={this.state.downloadUrl} responsive />
        );
    }
}


class AGCPlots extends React.Component {
    constructor(props) {
        super(props);
        this.downloadUrls = {};
        this.state = { downloadUrls: {} };
    }

    render() {
        return (
            <Grid>
                <Row>
                    {
                        this.props.nodeList ?

                            Object.keys(this.props.nodeList).map((nodeName, index) => (
                                <Col md={12} xs={12} key={index}>
                                    <Panel>
                                        <Panel.Heading>AGC Data - {nodeName}</Panel.Heading>
                                        <Panel.Body>
                                            {
                                                !!this.props.nodeList[nodeName].streamKey ?
                                                    (<AGCChart_rechart key={index} dataLimit={this.props.dataLimit} streamKey={this.props.nodeList[nodeName].streamKey} />)
                                                    : (null)
                                            }
                                            {
                                                this.props.nodeList[nodeName].specKey ?
                                                    (<SpecPlot gsloc={this.props.nodeList[nodeName].specKey} />) :
                                                    (null)
                                            }
                                        </Panel.Body>
                                    </Panel>
                                </Col>
                            )) : null
                    }
                </Row>
            </Grid>
        );
    }
};

export default AGCPlots;
