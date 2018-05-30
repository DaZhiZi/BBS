import React, {Component} from 'react';
import UserInfo from '../../components/user_info/index'
import ChangePassword from '../../components/change_password/index'
import './index.css'
import ChangeUserinfo from "../../components/change_userinfo";

class User extends React.Component {

    render() {
        return (
            <div className="pannel-add-topic">
                <ChangeUserinfo />
                <UserInfo />
                <ChangePassword />
            </div>
        );
    }
}

export default User;