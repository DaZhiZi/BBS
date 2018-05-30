
import React, {Component} from 'react';
import {ajax} from '../../service/ajax';
import  ReactDOM from 'react-dom'
import {Link} from 'react-router-dom';
import './style.css';

import emitter from "../../tool/events"
import { Form, Button, message, Input, Tag } from 'antd';
const FormItem = Form.Item;

class AddTopic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cnname: '',
            enname: '',
            topics:[],
            topic_id:'',
        }
    }
    deleteTopic () {

    }
    tpl_topic () {
        let _this = this
        // 调用两次
        console.count('tpl');
        let url = _this.state.topics.map(function (obj) {
            let o = <Tag closable
                         data-topic-id={obj._id}
                         data-enname={obj.enName}
                         onClose={_this.deleteTopic.bind(this)}
                         key={obj._id}
            >
                {obj.cnName}
                </Tag>
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

    }
    commitNewTopic() {
        let _this = this
        let data  = {
            cnName:_this.state.cnname,
            enName:_this.state.enname,
        }
        console.log('commitReply', data);
        // 注意绑定this
        ajax({
            method  : 'POST',
            url    : '/topic/add',
            data    : data,
            callback: _this.cbAddTheme.bind(_this)
        })
    }
    cbAddTheme (r) {
        // console.log('cbAddReply', r);
        let res = JSON.parse(r.response)
        let m = res.message
        if (res.success == true) {
            message.success(m, 10)
        } else {
            message.error(m, 5);
        }
    }

    handleEn (e) {
        let v = e.target.value
        this.setState({
            enname:v
        })
    }
    handleCn (e) {
        let v = e.target.value
        this.setState({
            cnname:v
        })
    }
    render() {
        let _this = this
        let topicTag = _this.tpl_topic()
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        };
        return (
            <div className="panel">
                <div className="header">
                    <Link to={"/"}/>
                    <span>新增Topic</span>
                </div>
                <div className="inner">
                    <Form layout="vertical">
                        <FormItem
                            {...formItemLayout}
                            label="topic"
                        >
                            {topicTag}
                        </FormItem>
                        <FormItem
                            label="topic中文名称"
                            {...formItemLayout}
                        >
                            <Input placeholder="topic中文名称"
                                   value={this.state.cnname}
                                   onChange={this.handleCn.bind(this)}/>
                        </FormItem>
                        <FormItem
                            label="topic英文名称"
                            {...formItemLayout}
                        >
                            <Input placeholder="topic英文名称"
                                   value={this.state.enname}
                                   onChange={this.handleEn.bind(this)}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label=" "
                        >
                            <Button type="primary" onClick={_this.commitNewTopic.bind(this)}>添加新topic</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default AddTopic
