import React from 'react';
import {Panel} from 'react-bootstrap';
import withAuthorization from './withAuthorization';
import {VictoryLine, VictoryChart,VictoryTheme} from 'victory';

const data = [
    {quarter: 1, earnings: 10},
    {quarter: 2, earnings: 10},
    {quarter: 3, earnings: 7},
    {quarter: 4, earnings: 7}
  ];

class AGCPlot extends React.Component {
    render(){
        return (
            <Panel>
                <Panel.Heading>AGC Data</Panel.Heading>
                <Panel.Body>
                    <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
                        <VictoryLine data={data} x="quarter" y="earnings"/>
                    </VictoryChart>
                </Panel.Body>
            </Panel>
        );
    }
};

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AGCPlot);