import React from 'react';
import {Grid,Row,Col} from 'react-bootstrap';
import withAuthorization from './withAuthorization';
import AGCPlot from './AGCPlot';

const data = [
    {quarter: 1, earnings: 10},
    {quarter: 2, earnings: 10},
    {quarter: 3, earnings: 7},
    {quarter: 4, earnings: 7}
  ];

class NodeAGCPlots extends React.Component {
    render(){
        return (
            <Grid>
                <Row>
                    <AGCPlot />
                </Row>
            </Grid>
        );
    }
};

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(NodeAGCPlots);