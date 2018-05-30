import React, {Component} from 'react';
import {ajax} from '../../service/ajax';

import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;



class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            header: "无人回复的话题",
            inner:[],
            username:'',
            password:'',
        }
    }

    getRegisterData () {
        var username = this.state.username
        var password = this.state.password
        var data = {
            username: username,
            password: password,
        }
        return data
    }
    register () {
        let data = this.getRegisterData()
        console.log('data', data);
        ajax({
            method  : 'POST',
            url    : '/register',
            data    : data,
            callback: this.cbRegister
        })
    }

    cbLogin (r) {
        // console.log('res', r.response)
        let res = JSON.parse(r.response)
        console.log('res', res)
        if (res.success) {
            if (res.data.admin) {
                window.location.href = '/admin'
            } else {
                window.location.href = '/'
            }
        } else {
            console.log('res错误', res)
        }
    }
    cbRegister (r) {
        let res = JSON.parse(r.response)
        if (res.success == true) {
            console.log('注册成功', res)
        } else {
            console.log('注册失败', res.message)
        }
    }
    login() {
        let data = this.getRegisterData()
        ajax({
            method  : 'POST',
            url    : '/login',
            data    : data,
            callback: this.cbLogin
        })
    }
    handleUsername (e) {
        var v = e.target.value
        this.setState({
            username:v,
        })
        // return v
    }
    handlePassword (e) {
        var v = e.target.value
        this.setState({
            password:v,
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    <Input prefix={<Icon type="user" className='input-pre-icon' />} placeholder="Username" onChange={this.handleUsername.bind(this)} value={this.state.username}/>
                </FormItem>
                <FormItem>
                    <Input prefix={<Icon type="lock" className='input-pre-icon' />} type="password" placeholder="Password" onChange={this.handlePassword.bind(this)} value={this.state.password}/>
                </FormItem>
                <div className='div-button-list'>
                    <Button type="primary" className="register-form-button" onClick={this.register.bind(this)}>
                        注册
                    </Button>
                    <Button type="primary" className="login-form-button" onClick={this.login.bind(this)}>
                        登录
                    </Button>
                </div>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;