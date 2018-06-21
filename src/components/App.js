import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';

import Navigation from './Navigation';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import * as routes from '../constants/routes';
import ExpHistList from './history/ExpHistList';
import ExpHistDetail from './history/ExpHistDetail';
import Localize from './Localization';
import Experiments from './Experiments';
import SystemInfo from './System';
import ExpControl from './exp/ExpControl';
import NodeStatus from './NodeStatus';
import withAuthentication from './HOCs/withAuthentication';

const App = () => (
  <Router>
    <Grid>
      <Row>
        <Col xs={12} md={12}>
          <Navigation />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs={12} md={12}>
          <Route
            exact path={routes.LANDING}
            component={() => <LandingPage />}
          />
          <Route
            exact path={routes.SIGN_UP}
            component={() => <SignUpPage />}
          />
          <Route
            exact path={routes.SIGN_IN}
            component={() => <LoginPage />}
          />
          <Route
            exact path={routes.SIGN_UP}
            component={() => <SignUpPage />}
          />
          <Route
            exact path={routes.HISTORY}
            component={() => <ExpHistList />}
          />
          <Route 
            exact path={routes.LOCALIZE}
            component={() => <Localize />}
          />
          <Route
            path={routes.HISTORY_DETAIL}
            render={(props) => <ExpHistDetail {...props} />}
          />
          <Route
            path={routes.EXP_CONTROL}
            render={(props) => <ExpControl {...props} /> }
          />
          <Route
            exact path={routes.NODE_STATUS}
            render={(props)=><NodeStatus {...props} /> }
          />
          <Route
            exact path={routes.EXP}
            render={()=><Experiments />}
          />
          <Route
            exact path={routes.SYSTEM}
            render={()=><SystemInfo />}
          />
        </Col>
      </Row>
    </Grid>
  </Router>
);


export default withAuthentication(App);
