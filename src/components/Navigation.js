import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import "./App.css"
import * as routes from '../constants/routes';
import LogoutButton from './Logout';

import {Navbar,Nav,NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

const AuthdLinks = () => (
  <Nav>
    <LinkContainer to={routes.HOME} exact="true"><NavItem>Control Page</NavItem></LinkContainer>
    <LinkContainer to={routes.AGC_PLOTS} exact="true"><NavItem>AGC Data</NavItem></LinkContainer>
    <LinkContainer to={routes.SPEC_PLOTS}><NavItem>Spec. Plots</NavItem></LinkContainer>
    <NavItem><LogoutButton /></NavItem>
  </Nav>
);
const NonAuthdLinks = () => (
  <Nav>
      <LinkContainer to={routes.LANDING} exact="true"><NavItem>Landing</NavItem></LinkContainer>
      <LinkContainer to={routes.SIGN_UP}><NavItem>Signup</NavItem></LinkContainer>
      <LinkContainer to={routes.SIGN_IN}><NavItem>Login</NavItem></LinkContainer>
  </Nav>
);

const Header = (props, {authUser}) => (
  <Navbar>
            <Navbar.Header> 
              <Navbar.Brand>
                <Link to={routes.HOME}>GNSS Control Center</Link>
              </Navbar.Brand>
            </Navbar.Header>
           { authUser ? <AuthdLinks /> : <NonAuthdLinks /> }
  </Navbar>
)

const Navigation = (props,{authUser}) => (
  <div>
    <Header />
  </div>
)

Header.contextTypes = {
  authUser: PropTypes.object,
};

Navigation.contextTypes = {
  authUser: PropTypes.object,
};



export default Navigation;