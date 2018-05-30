import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ajax} from '../../service/ajax';

import '../../style/index.css';
import './style.css';

class ThemeCell extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let obj = this.props.data
        let proxyUrl = ''
        return (
            <div className="cell">
                <Link className="user-avatar" to={'/user/' + obj.userInfo.user_id}>
                    <img src={proxyUrl + obj.userInfo.avatar} title={obj.userInfo.username}/>
                </Link>
                <div className="reply-count">
                    <span className="count-of-replies" title="回复数">{obj.browseInfo.reply_num}</span>
                    <span className="count-seperator">/</span>
                    <span className="count-of-visits" title="点击数">{obj.browseInfo.view_num}</span>
                </div>
                <div className="topic-title-wrapper">
                    <span className={"topic-type " + obj.topicInfo.enName}>{obj.topicInfo.cnName}</span>
                    <Link className="theme-title" to={'/theme/detail/' + obj._id} title={obj.title}>
                        {obj.title}
                    </Link>
                </div>
                <Link className="last-time" to={'/theme/detail/' + obj['_id'] + '#' + obj.lastReplyInfo._id}>
                    <img className="user-small-avatar" src={proxyUrl + obj.lastReplyInfo.userInfo.avatar}/>
                    <span className="last-reply-time">{obj.lastReplyInfo.update_at}</span>
                </Link>
            </div>
        );
    }
}

export default ThemeCell
