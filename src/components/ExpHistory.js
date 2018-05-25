import React from 'react';
import {Grid,Row,Col} from 'react-bootstrap';
import withAuthorization from './withAuthorization';
import {Panel} from 'react-bootstrap';
import {firebase} from '../firebase/index';
import {Link} from 'react-router-dom';

class ExpHistory extends React.Component {;
    constructor(props)
    {
        super(props);
        this.expList = {};
        this.state = {
            expList: {}
        };
    }

    componentWillMount()
    {
        let expRef = firebase.db.ref('/expinfo').orderByChild("start_time").limitToLast(30);

        expRef.on('child_added', (snapshot) => {
            this.expList[snapshot.key] = snapshot.val();
            this.setState({expList: this.expList});
        });
    }

    render(){
        const options = {  
            weekday: "long", year: "numeric", month: "short",  
            day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Denver"
        };
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <Panel>
                            <Panel.Heading>Past Experiments</Panel.Heading>
                            <Panel.Body>
                                <ul>
                                {
                                    Object.keys(this.state.expList).reverse().map( (expKey,i) => (
                                        <li key={i}>
                                            <Link to={"/history/"+expKey}>{ (new Date(this.state.expList[expKey].start_time)).toLocaleString("en-US",options)}</Link>
                                        </li>
                                    ))                                    
                                }
                                </ul>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
};

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(ExpHistory);