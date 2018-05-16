import React, {Component} from 'react';
import {firebase} from '../firebase/index';
import {Grid,Row,Panel} from 'react-bootstrap';
import AGCPlots from './AGCPlot';

class ExpDetail extends Component 
{
    constructor(props){
        super(props);
        this.nodeList = {}
        this.state = {
            nodeList: {},            
            expName: "",
            intList: {}
        };
    }
    componentWillMount(){   
        firebase.db.ref("expinfo/" + this.props.match.params.id +"/agcplots").once('value', (snapshot) => {
            snapshot.forEach( (nodeSnap) => {
                this.nodeList[nodeSnap.key] = {
                    'streamKey': nodeSnap.val()
                };
            });
            this.setState({nodeList: this.nodeList});
        });
        firebase.db.ref("expinfo/"+this.props.match.params.id+"/expname").once('value',(snapshot)=>{
            this.setState({expName:snapshot.val()});
        })
        firebase.db.ref("expinfo/"+this.props.match.params.id+"/int").on('child_added',(snapshot)=>{
            this.intList[snapshot.key] = snapshot.val();
            this.setState({intList:this.intList});
        });
    }
    
    render() 
    {
        const options = {  
            weekday: "long", year: "numeric", month: "short",  
            day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Denver"
        };
        return (
            <div>
                <Grid>
                    <Row>
                        <Panel>
                            <Panel.Heading>
                                Experiment Info
                            </Panel.Heading>
                            <Panel.Body>
                                <h3>Name: {this.state.expName}</h3>                                
                            </Panel.Body>
                        </Panel>
                    </Row>
                    <Row>
                       <AGCPlots nodeList={this.state.nodeList} />
                    </Row>
                    <Row>
                        <Panel>
                            <Panel.Heading>
                                Jammer Locations
                            </Panel.Heading>
                            <Panel.Body>
                                <ul>
                                {
                                    Object.keys(this.state.intList).reverse().map( (expKey,i) => (
                                        <li key={i}>
                                         <p>{ (new Date(this.state.intList[expKey].time*1000)).toLocaleString("en-US",options)}</p>
                                         <p>Lat: {this.state.intList[expKey].lat}</p>
                                         <p>Long: {this.state.intList[expKey].long}</p>
                                        </li>
                                    ))                                    
                                }
                                </ul>
                            </Panel.Body>
                        </Panel>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default ExpDetail;