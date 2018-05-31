import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';

import Navigation from './Navigation';
import LandingPage from './LandingPage';
import SignUpPage from './SignupPage';
import LoginPage from './LoginPage';
import * as routes from '../constants/routes';
import ExpHistory from './ExpHistory';
import ExpDetail from './ExpDetail';
import Localize from './Localization';
import Experiments from './Experiments';
import ExpControl from './ExpControl';
import NodeStatus from './NodeStatus';
import withAuthentication from './withAuthentication';
import NodeControl from './NodeControl';

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
            component={() => <ExpHistory />}
          />
          <Route 
            exact path={routes.LOCALIZE}
            component={() => <Localize />}
          />
          <Route
            path={routes.HISTORY_DETAIL}
            render={(props) => <ExpDetail {...props} />}
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
            path = {routes.NODE_CONTROL}
            render={(props)=> <NodeControl {...props} /> }
          />
          <Route
            exact path={routes.EXP}
            render={()=><Experiments />}
          />
        </Col>
      </Row>
    </Grid>
  </Router>
);


export default withAuthentication(App);
