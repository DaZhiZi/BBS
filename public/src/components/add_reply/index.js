
import React, {Component} from 'react';
import {ajax} from '../../service/ajax';
import Editor from '../editor/index'
import  ReactDOM from 'react-dom'
import { message } from 'antd';
import './style.css';
import SimpleMDE from 'simplemde'
//CSS文件路径不能为simplemde/src/simplemdecss,有bug
import 'simplemde/dist/simplemde.min.css';

import emitter from "../../tool/events"
import { Button } from 'antd';

class ReplyAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 5,
            inner:[],
        }
    }

    componentWillMount () {

    }

    componentDidMount() {
        let _this = this
        this.state.editor = new SimpleMDE({
            element: _this.refs.add_reply_editor,
            spellChecker: false,
            // autofocus:true,
            placeholder:'添加回复',
            renderingConfig:{
                codeSyntaxHighlighting:true,
            },
            status: false,
        });
    }
    async commitReply() {
        let _this = this
        let c = _this.state.editor.value()
        let ds  = {
            content : c,
            theme_id: _this.props.theme_id,
        }
        console.log('commitReply', ds);
        // 注意绑定this
        ajax({
            method  : 'POST',
            data    : ds,
            url    : '/reply/add',
            callback: _this.cbAddReply.bind(this)
        })
    }
    cbAddReply (r) {
        // console.log('cbAddReply', r);
        let res = JSON.parse(r.response)
        if (res.success == true) {
            emitter.emit("refresh-reply-list", 'success')
        } else {
            let m = res.message
            message.error(m, 5);
        }
        // 应该让list_reply刷新，而不是增加一条
        //因为在你add reply的时候，可能有新的
    }
    render() {
        let _this = this
        return (
            <div className="panel">
                <div className="header">
                    <span className="col_fade">添加回复</span>
                </div>
                <div className="inner">
                    <textarea ref='add_reply_editor'></textarea>
                    <Button type="primary" onClick={_this.commitReply.bind(this)}>回复</Button>
                </div>
            </div>
        );
    }
}

export default ReplyAdd
