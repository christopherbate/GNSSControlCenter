import React, { Component } from 'react';
import {Grid,Col,Row,Jumbotron,Button} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import * as routes from '../constants/routes';

class LandingPage extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Jumbotron>
              <h1>GUI for MZNT System</h1>
              <p>Login or Create an Account to start data collection and analysis.</p>
              <p>
                <LinkContainer to={routes.SIGN_UP}>
                  <Button bsStyle="primary">
                  Register
                  </Button>
                </LinkContainer>
              </p>
            </Jumbotron>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default LandingPage;