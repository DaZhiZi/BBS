
/**
 * Created by ocean on 18/3/1.
 */
import React, {Component} from 'react';
import {Icon} from 'antd';
import {Link} from 'react-router-dom';
import './style.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            liArr: [
                {key: '首页', link: '/', text: '首页'},
                {key: '管理员', link: '/admin', text: '管理员'},
                {key: '设置', link: '/user', text: '设置'},
                {key: '退出', link: '/#', text: '退出'},
                {key: '登录', link: '/login', text: '登录'},
            ],
            baseUrl:"?pageNum=1&pageSize=10"
        }
    }
    linkHtml () {
        let _this = this
        let url = _this.state.liArr.map(function (obj) {
            return  <li key={obj.key}>
                        <Link to={obj.link}>{obj.text}</Link>
                    </li>
        })
        return url
    }
    render() {
        return (
            <div className="navbar">
                <ul className="bar-style">
                    <li className="logo-style" key="logo">
                        <Icon className="Icon-style" type="api"/>
                        <a rel="noopener noreferrer" target="_blank">cNode · 练手项目</a>
                    </li>
                    { this.linkHtml() }
                </ul>
            </div>
        );
    }
}

export default Header
