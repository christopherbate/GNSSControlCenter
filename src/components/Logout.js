import React from 'react';
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