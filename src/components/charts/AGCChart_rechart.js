import React from 'react';
import { firebase } from '../../firebase/index';
import {LineChart, Line, XAxis,YAxis,Legend, ResponsiveContainer, Brush} from 'recharts';

class AGCChart_rechart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
        this.refLocation = '/agcdata/';
      }

    componentWillMount() {
        this.refLocation = '/agcdata/' + this.props.streamKey;

        var limit = this.props.dataLimit > 0 ? this.props.dataLimit : 99999;
        if(this.props.singleUse === true){
            firebase.db.ref('/agcdata/' + this.props.streamKey).once('value', (snap) => {
                if(snap.val()){
                    var myData = [];
                    snap.forEach( (item) =>{
                        myData.push( {
                            time: parseInt(item.key),
                            ch1: item.val().ch0,
                            ch2: item.val().ch1,
                            ch3: item.val().ch2,
                            ch4: item.val().ch3
                        });
                    });
                    this.setState({
                        data: myData
                    });
                }           
            });
        } else {
            firebase.db.ref('/agcdata/' + this.props.streamKey).limitToLast(limit).on('child_added', (snap) => {
                if(snap.val()){
                    this.setState(function(prevState,props) {                        
                        if(prevState.data.length >= limit ){
                            prevState.data.shift();
                        }
                        return {data: prevState.data.concat({
                            time:  parseInt(snap.key),
                            ch1: snap.val().ch0,
                            ch2: snap.val().ch1,
                            ch3: snap.val().ch2,
                            ch4: snap.val().ch3
                        })};
                    });
                }           
            });
        }        
    }

    componentWillUnmount() {
        if (this.refLocation) {
            firebase.db.ref(this.refLocation).off();
        }
    }

    render() {
        const timeOpt = {timeZone: 'America/Denver',hour:'numeric',minute:'numeric', hour12: false};
        const tickFormatter = (tick) => (new Date(tick)).toLocaleString('en-US',timeOpt);
        return (
            <ResponsiveContainer width="90%" height={200}>
                <LineChart  data={this.state.data} isAnimationActive={false}>                    
                    <XAxis dataKey='time'/>
                    <YAxis />
                    <Legend verticalAlign="top" height={36}/>
                    <Line name="GPS L1"type="monotone" dataKey="ch1" stroke="#c43a31" isAnimationActive={false}/>
                    <Line name="GPS L2" type="monotone" dataKey="ch2" stroke="#fd9684" isAnimationActive={false} />
                    <Line name="GLO L1" type="monotone" dataKey="ch3" stroke="#195fd6" isAnimationActive={false} />
                    <Line name ="GLO L2" type="monotone" dataKey="ch4" stroke="#1393e1" isAnimationActive={false} />
                    <Brush />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default AGCChart_rechart;