
import React, {Component} from 'react';
import {ajax} from '../../service/ajax';
import Editor from '../editor/index'
import  ReactDOM from 'react-dom'
import {Link} from 'react-router-dom';
import './style.css';
import SimpleMDE from 'simplemde'
//CSS文件路径不能为simplemde/src/simplemdecss,有bug
import 'simplemde/dist/simplemde.min.css';

import emitter from "../../tool/events"
import { Form, Button, Select, message, Input } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

class AddTheme extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            topics:[],
            topic_id:'',
        }
    }
    tpl_topic () {
        // 调用两次
        console.count('tpl');
        let url = this.state.topics.map(function (obj) {
            let o =<Option value={obj._id} className={obj.enName} key={obj._id}>{obj.cnName}</Option>
            return o
        })
        return url
    }
    async componentWillMount() {
        let data = await ajax({
            url:'/topic/all',
            sync:false,
        })
        let res = data
        let topics = res.data
        if (res.success) {
            this.setState({
                topics:topics,
            })
        }
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
    commitTheme() {
        let _this = this
        let c = _this.state.editor.value()
        let ds  = {
            title:_this.state.title,
            topic_id:_this.state.topic_id,
            content : c,
        }
        console.log('commitReply', ds);
        // 注意绑定this
        ajax({
            method  : 'POST',
            data    : ds,
            url    : '/reply/add',
            callback: _this.cbAddTheme.bind(this)
        })
    }
    cbAddTheme (r) {
        // console.log('cbAddReply', r);
        let res = JSON.parse(r.response)
        if (res.success == true) {
            message.success(res, 10)
        } else {
            let m = res.message
            message.error(m, 5);
        }
        // 应该让list_reply刷新，而不是增加一条
        //因为在你add reply的时候，可能有新的
    }

    handleTitle (e) {
        let v = e.target.value
        this.setState({
            title:v
        })
    }
    handleTopic(v) {
        this.setState({
            topic_id:v
        })
    }
    render() {
        let _this = this
        let topicOption = _this.tpl_topic()
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        };
        return (
            <div className="panel">
                <div className="header">
                    <Link to={"/"}/>
                    <span>新增帖子</span>
                </div>
                <div className="inner">
                    <Form layout="vertical">
                        <FormItem
                            label="theme标题"
                            {...formItemLayout}
                        >
                            <Input placeholder="theme title"
                                   value={this.state.title}
                                   onChange={this.handleTitle.bind(this)}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="topic"
                        >
                            <Select defaultValue="请选择" onSelect={this.handleTopic.bind(this)}>
                                {topicOption}
                            </Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="内容"
                        >
                            <textarea ref='add_reply_editor'></textarea>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label=" "
                        >
                            <Button type="primary" onClick={_this.commitTheme.bind(this)}>回复</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default AddTheme
