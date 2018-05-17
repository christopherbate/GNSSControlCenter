import React from 'react';
import { Grid, Panel, Row, Col, Image } from 'react-bootstrap';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryLegend, VictoryAxis } from 'victory';
import { firebase } from '../firebase/index';

const reducer = (accumulator, currentValue) => ({ ch1: accumulator.ch1 + currentValue.ch1 });

class AGCChart extends React.Component {
    constructor(props) {
        super(props);
        this.data = [];
        console.log(this.props.streamKey);
        this.state = {
            data: [],
            agcAvg: 0
        };
        this.movingAvg = {
            ch1: 0,
            ch2: 0,
            ch3: 0,
            ch4: 0
        };
        this.refLocation = null;
    }
    componentWillMount() {
        this.refLocation = '/agcdata/' + this.props.streamKey;
        firebase.db.ref('/agcdata/' + this.props.streamKey).limitToLast(60).on('child_added', (snap) => {
            this.data.push({
                x: new Date(snap.key * 1000), 
                ch1: snap.val().ch0,
                ch2: snap.val().ch1, 
                ch3: snap.val().ch2,
                ch4: snap.val().ch3
            });
            if (this.data.length > 120) {
                this.data = this.data.slice(1);
            }
            if(this.data.length>0){
                this.movingAvg = this.data.reduce(reducer);
                this.movingAvg.ch1 = this.movingAvg.ch1 / this.data.length;
            } else {
                this.movingAvg = this.data.reduce(reducer, 0);
            }
            this.setState({data: this.data, agcAvg: this.movingAvg });
        });
    }

    componentWillUnmount() {
        if (this.refLocation) {
            firebase.db.ref(this.refLocation).off();
        }
    }
    render() {
        return (
            <div>
                <h3>L1 Moving Avg: {this.state.agcAvg.ch1}</h3>
                <VictoryChart domainPadding={20} theme={VictoryTheme.material} scale={{ x: "time" }}>
                    <VictoryLegend x={0} y={0}
                        orientation="horizontal"
                        gutter={20}
                        style={{ border: { stroke: "black" } }}
                        data={[
                            { name: "GPS L1", symbol: { fill: "#c43a31" } },
                            { name: "GPS L2", symbol: { fill: "#fd9684" } },
                            { name: "GLO L1", symbol: { fill: "#195fd6" } },
                            { name: "GLO L2", symbol: { fill: "#1393e1" } }
                        ]}
                    />
                    <VictoryLine style={{
                        data: { stroke: "#c43a31" },
                        parent: { border: "1px solid #ccc" }
                    }} data={this.state.data} x="x" y="ch1" />
                    <VictoryLine data={this.state.data} style={{
                        data: { stroke: "#195fd6" },
                        parent: { border: "1px solid #ccc" }
                    }} x="x" y="ch2" />
                    <VictoryLine data={this.state.data} style={{
                        data: { stroke: "#1393e1" },
                        parent: { border: "1px solid #ccc" }
                    }} x="x" y="ch3" />
                    <VictoryLine data={this.state.data} style={{
                        data: { stroke: "#fd9684" },
                        parent: { border: "1px solid #ccc" }
                    }} x="x" y="ch4" />
                </VictoryChart>
            </div>
        );
    }
}

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
                                <Col md={6} xs={12} key={index}>
                                    <Panel>
                                        <Panel.Heading>AGC Data - {nodeName}</Panel.Heading>
                                        <Panel.Body>
                                            { 
                                                this.props.nodeList[nodeName].streamKey ? 
                                                ( <AGCChart key={index} streamKey={this.props.nodeList[nodeName].streamKey} /> ) 
                                                : (null)  
                                            }                                            
                                            { 
                                                this.props.nodeList[nodeName].specKey ? 
                                                ( <SpecPlot gsloc={this.props.nodeList[nodeName].specKey} />) : 
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
export { AGCChart };