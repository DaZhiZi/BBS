
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ajax} from '../../service/ajax';

import '../../style/index.css';
import './style.css';
import emitter from "../../tool/events"
import {message} from "antd";

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_info: {},
            inner:[],

        }
    }
    tpl () {

        let _this = this
        let url = _this.state.inner.map(function (obj) {
            return <span data-topicid={obj._id} className={"topic-tab " + obj.enName} key={obj._id}   onClick={_this.changeTopic}>{obj.cnName}</span>
        })
        return url
    }
    componentWillMount() {
        let _this = this
        ajax({
            url:'/user/info/data',
            callback: _this.cbAddTheme.bind(_this)
        })
    }
    cbAddTheme (r) {
        let res = JSON.parse(r.response)
        // console.log('cbAddReply', res);
        let m = res.message
        let data = res.data
        if (res.success == true) {
            message.success(m, 10)
            this.setState({
                user_info:data
            })
        } else {
            message.error(m, 5);
        }
    }
    render() {
        let _this = this
        let obj = _this.state.user_info
        return (
            <div className='panel user-info'>
                <div className="header">个人信息</div>
                <div className="inner">
                    <Link className="user-avatar" to={"/user/" + obj.username}>
                        <img src={obj.avatar} title={obj.username} />
                    </Link>
                    <div className="user-name">
                        <Link className="dark" to={"/user/" + obj.username}>{obj.username}</Link>
                    </div>
                    <div className="user-signature">
                        {obj.signature}
                    </div>
                </div>
            </div>
        );
    }
}

export default UserInfo
