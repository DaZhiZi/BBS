
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ajax} from '../../service/ajax';

import '../../style/index.css';
import './style.css';

class NoReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: "无人回复的话题",
            inner:[],
        }
    }
    tpl () {
        // 调用两次
        // console.count('tpl');
        let url = this.state.inner.map(function (obj) {
            return <li  key={obj._id}>
                <Link to={'/theme/detail/' + obj._id} title={obj.title}>{obj.title}</Link>
            </li>
        })
        return url
    }
    async componentDidMount() {
        let data = await ajax({
            url:'/theme/noReply',
            sync:false,
        })
        let res = data
        let inner = res.data
        if (res.success) {
            this.setState({
                inner:inner,
            })
        }
    }
    render() {
        return (
            <div className={'panel no-reply-theme'}>
                <div className="header">
                    {this.state.header}
                </div>
                <div className="inner">
                    {this.tpl()}
                </div>
            </div>
        );
    }
}

export default NoReply
