import React, {Component} from 'react';
import {ajax} from '../../service/ajax';
import {Link} from 'react-router-dom';
import './style.css';

import { Form, Button, message, Input } from 'antd';
const FormItem = Form.Item;

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldP: '',
            newP: '',
            confirmP:'',
        }
    }

    componentWillMount() {

    }
    componentDidMount() {

    }
    dataP () {
        let o = {
            oldP: this.state.oldP,
            newP: this.state.newP,
            confirmP:this.state.confirmP,
        }
        return o
    }
    validP (o) {
        let s = true
        if (o.newP !== o.confirmP) {
            s = false
            message.warning("新密码与确认密码不一致")
        }
        if (o.oldP == o.newP) {
            s = false
            message.warning("新密码与老密码相同")
        }
        return s
    }
    changeP() {
        let _this = this
        let data  = _this.dataP()
        let v = _this.validP(data)
        if (v == false) {
            return ''
        }
        ajax({
            method  : 'POST',
            url    : '/user/password',
            data    : data,
            callback: _this.cbChangeP.bind(_this)
        })
    }
    cbChangeP (r) {
        // console.log('cbAddReply', r);
        let res = JSON.parse(r.response)
        let m = res.message
        if (res.success == true) {
            message.success(m, 5)
            // 是否应该重新登录。
        } else {
            message.error(m, 5);
        }
    }

    handleOld (e) {
        let v = e.target.value
        this.setState({
            oldP:v
        })
    }
    handleNew (e) {
        let v = e.target.value
        this.setState({
            newP:v
        })
    }
    handleConfirm (e) {
        let v = e.target.value
        this.setState({
            confirmP:v
        })
    }
    render() {
        let _this = this
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        };
        return (
            <div className="panel">
                <div className="header">
                    <span>修改密码</span>
                </div>
                <div className="inner">
                    <Form layout="vertical">
                        <FormItem
                            label="老密码"
                            {...formItemLayout}
                        >
                            <Input placeholder="老密码"
                                   value={this.state.oldP}
                                   onChange={this.handleOld.bind(this)}
                            />
                        </FormItem>
                        <FormItem
                            label="新密码"
                            {...formItemLayout}
                        >
                            <Input placeholder="新密码"
                                   value={this.state.newP}
                                   onChange={this.handleNew.bind(this)}
                            />
                        </FormItem>
                        <FormItem
                            label="确认密码"
                            {...formItemLayout}
                        >
                            <Input placeholder="确认密码"
                                   value={this.state.confirmP}
                                   onChange={this.handleConfirm.bind(this)}
                            />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label=" "
                        >
                            <Button type="primary" onClick={_this.changeP.bind(this)}>修改</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default ChangePassword
