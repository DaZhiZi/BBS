import React, {Component} from 'react';
import Login from '../../components/login/index'

import './index.css'

class LoginPage extends React.Component {

    render() {
        return (
            <div className="div-login">
                <Login />
            </div>
        );
    }
}

export default LoginPage;