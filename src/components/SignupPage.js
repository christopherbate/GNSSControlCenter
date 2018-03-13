import React, { Component } from 'react';

import {Link, withRouter} from 'react-router-dom';
import {auth} from '../firebase/index';
import * as routes from '../constants/routes';
import {FormGroup,Grid,Col,Row,FormControl,Form, Button} from 'react-bootstrap';

class SignUpPage extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
          <h1>Create an Account</h1>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={12}>
          <SignUpForm history={this.props.history} />       
          </Col>
        </Row>
      </Grid>
    );
  }
}

class SignUpForm extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      error: null
    };
  }

  onSubmit = (event) => {
    //const history = this.props.history;

    auth.fbSignup(this.state.email, this.state.password).then( authUser => {
      this.setState( {username: '',
      email: '',
      password: '',
      error: null} );

      this.props.history.push(routes.HOME);
    }).catch( error => {
      this.setState({'error': error});
    });

    event.preventDefault();
  }

  render() {

    const isInvalid = this.state.password === '' || this.state.email === '';

    return(
            <Form horizontal onSubmit={this.onSubmit}>
              <FormGroup>
                <Col sm={2}>
                  Email
                </Col>
                <Col sm={10}>
                  <FormControl 
                    value={this.state.email}
                    onChange={event => this.setState({'email': event.target.value})}
                    type = "text"
                    placeholder="Email"
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={2}>
                  Password
                </Col>
                <Col sm={10}>
                  <FormControl
                    value={this.state.password}
                    onChange={event => this.setState({'password': event.target.value})}
                    type = "password"
                    placeholder="Password"
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={12}>
                  <Button bsStyle="primary" type="submit" disabled={isInvalid}>
                    Sign Up
                  </Button>
                </Col>
              </FormGroup>
              <FormGroup>
                { this.state.error && <p>{this.state.error.message}</p>}
              </FormGroup>
            </Form>
    );
  }
};

const SignUpLink = () => {
  return (
    <p>
      SignUp for an Account.
      {' '}
      <Link to={routes.SIGN_UP}>Sign Up></Link>
    </p>
  );
};

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink
}