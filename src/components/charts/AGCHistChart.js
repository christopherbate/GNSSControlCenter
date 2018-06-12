import React from 'react';
import { VictoryLine, VictoryChart, VictoryLegend, VictoryZoomContainer, VictoryBrushContainer} from 'victory';
import { firebase } from '../../firebase/index';

class AGCHistChart extends React.Component {
    constructor(props) {
        super(props);
        this.data = [];
        this.state = {
            zoomDomain: {x: [new Date(2018,1,1), new Date(2019,1,1)]}
        };
        this.refLocation = null;
    }
    handleZoom(domain){
        this.setState({zoomDomain: domain});
    }
    componentWillMount() {
        this.refLocation = '/agcdata/' + this.props.streamKey;
        var limit = this.props.dataLimit > 0 ? this.props.dataLimit : 99999;
        firebase.db.ref('/agcdata/' + this.props.streamKey).limitToLast(limit).on('child_added', (snap) => {
            this.data.push({
                x: snap.key, 
                ch1: snap.val().ch0,
                ch2: snap.val().ch1, 
                ch3: snap.val().ch2,
                ch4: snap.val().ch3
            });
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
                <VictoryChart width={600} height={200} domainPadding={20}
                    scale={{ x: "time" }}
                    containerComponent={
                        <VictoryZoomContainer
                            zoomDimension="x"
                            zoomDomain={this.state.zoomDomain}
                            onZoomDomainChange = {this.handleZoom.bind(this)}
                        />
                    }>

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
                <VictoryChart 
                    width={600}
                    domainPadding={20}
                    height={100}
                    scale={{x:"time"}}
                    containerComponent={
                        <VictoryBrushContainer 
                            brushDomain={this.state.zoomDomain} 
                            brushDimension="x" 
                            onBrushDomainChange={this.handleZoom.bind(this)} />                        
                    }
                    padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
                >
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

export default AGCHistChart;