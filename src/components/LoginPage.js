import React, { Component } from 'react';
import { auth } from '../firebase/index';
import * as routes from '../constants/routes';
import { withRouter } from 'react-router-dom';
import { FormGroup, Grid, Col, Row, FormControl, Form, Button } from 'react-bootstrap';


class LoginPage extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h1>Login</h1>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={12}>
            <LoginForm history={this.props.history} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      error: null
    };
  }
  onSubmit = (event) => {
    auth.fbLogin(this.state.email, this.state.password).then(
      () => {
        this.setState({
          username: '',
          email: '',
          password: '',
          error: null
        });
        this.props.history.push(routes.HOME);
      }
    ).catch(error => {
      this.setState({ 'error': error });
    });

    event.preventDefault();
  }
  render() {
    const isInvalid = this.state.passwoord === '' || this.state.email === '';
    return (
      <div>
        <Form horizontal onSubmit={this.onSubmit}>
          <FormGroup>
            <Col sm={2}>
              Email
            </Col>
            <Col sm={10}>
              <FormControl
                value={this.state.email}
                onChange={event => this.setState({ 'email': event.target.value })}
                type="text"
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
                onChange={event => this.setState({ password: event.target.value })}
                type="password"
                placeholder="Password"
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={12}>
              <Button bsStyle="primary" type="submit" disabled={isInvalid}>
                Login
            </Button>
            </Col>
          </ FormGroup>
        </Form>
        {this.state.error && <p>{this.state.error.message}</p>}
      </div>
    );
  }
}

export default withRouter(LoginPage);

export {
  LoginForm
};