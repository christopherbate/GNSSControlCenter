// react
import React from 'react';

// Style imports

// Routing
import {BrowserRouter as Router,Route} from 'react-router-dom';

// Sub components
import Navigation from './Navigation';
import LandingPage from './LandingPage';
import SignUpPage from './SignupPage';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import * as routes from '../constants/routes';
import ExpHistory from './ExpHistory';
import {Grid,Row,Col} from 'react-bootstrap';
import ExpDetail from './ExpDetail';

// Higher Order Components
import withAuthentication from './withAuthentication';

const App = () => (
  <Router>
    <Grid>
      <Row>
        <Col xs={12} md={12}>
          <Navigation />
        </Col>
      </Row>
      <hr/>
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
            exact path={routes.HOME}
            component={() => <HomePage />}
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
            path={routes.HISTORY_DETAIL}
            render={ (props) => <ExpDetail {...props} />}
          />
        </Col>
      </Row>
    </Grid>
  </Router>
);


export default withAuthentication(App);
