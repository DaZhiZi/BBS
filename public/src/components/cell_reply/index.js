import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ajax} from '../../service/ajax';

import './style.css';
import marked from "marked";

import { Icon } from 'antd';

class ReplyCell extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    turnMark (content) {
        let m = marked(content)
        return {__html: m};
    }
    render() {
        let _this = this
        let obj = this.props.data
        let reply_num = this.props.index
        let proxyUrl = "http://localhost:8081/"
        return (
            <div className="cell-reply reply-area reply-item" data-reply-id="{obj._id}" data-reply-to-id=""
                 id={obj._id}>
                <div className="author-content">
                    <a href={"/user/" + obj.userInfo.username} className="user-avatar">
                        <img src={obj.userInfo.avatar} title={obj.userInfo.username} />
                    </a>

                    <div className="user-info">
                        <a className="dark reply-author"
                           href={"/user/" + obj.userInfo.username}>{obj.userInfo.username}</a>
                        <a className="reply-time" href={"#" + obj._id}>{reply_num + 1}楼 • {obj.update_at}</a>
                    </div>

                    <div className="user-action">
                    <span>
                        <Icon type="like-o" className="icon-reply-up"/>
                        {/*<i className="glyphicon glyphicon-thumbs-up icon-reply-up" title="赞同"> </i>*/}
                        <span className="up-count">{obj.ups.length}</span>
                    </span>
                    <span>
                        <i className="fa fa-reply reply2-btn" title="回复"> </i>
                    </span>
                    </div>
                </div>
                <div className={"reply_content from-" + obj.userInfo.username}>
                    <div className="markdown-body" dangerouslySetInnerHTML={_this.turnMark(obj.content)}>
                        {/*{obj.content}*/}
                    </div>
                </div>
            </div>
        )
    }
}

export default ReplyCell
