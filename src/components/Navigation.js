import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as routes from '../constants/routes';
import {auth} from '../firebase/index';
import {Navbar,Nav,NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

class LogoutButton extends React.Component {
  render () {
      return (
          <p onClick={auth.fbLogout}>
              Logout
          </p>
      );
  }
}

const AuthdLinks = () => (
  <Nav>
    <LinkContainer to={routes.EXP}><NavItem>Experiments</NavItem></LinkContainer>
    <LinkContainer to={routes.NODE_STATUS}><NavItem>Nodes</NavItem></LinkContainer>
    <LinkContainer to={routes.HISTORY}><NavItem>History</NavItem></LinkContainer>
    <LinkContainer to={routes.LOCALIZE}><NavItem>Localize</NavItem></LinkContainer>    
    <NavItem><LogoutButton /></NavItem>
  </Nav>
);
const NonAuthdLinks = () => (
  <Nav>
      <LinkContainer to={routes.LANDING}><NavItem>Landing</NavItem></LinkContainer>
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