import React from 'react';
//import {Button} from 'react-bootstrap';
import {auth} from '../firebase/index';

class LogoutButton extends React.Component {
    render () {
        return (
            <p onClick={auth.fbLogout}>
                Logout
            </p>
        );
    }
}

export default LogoutButton;