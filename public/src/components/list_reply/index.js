
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ajax} from '../../service/ajax';
import ReplyCell from '../cell_reply/index'

import '../../style/index.css'
import './style.css';

import emitter from "../../tool/events"

class ReplyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 5,
            inner:[],
            topic_id:'all',
            pagination:{
                current:1,
                total:10,
                pageSize:4,
            },
            page:1,
            hasReply:true,
        }
    }

    tpl () {
        let url = this.state.inner.map(function (obj, index) {
            return <ReplyCell data={obj} index={index} key={obj._id}/>
        })
        return url
    }

    async setHtml (theme_id, ) {
        let data = await ajax({
            url:`/reply/all/${theme_id}`,
            sync:false,
        })
        let res = data
        let inner = res.data
        if (res.success && inner.length > 0) {
            this.setState({
                inner:inner,
            })
        } else if (inner.length == 0) {
            this.setState({
                hasReply:false,
            })
        }
    }

    componentWillMount () {
        let theme_id = this.props.theme_id
        this.setHtml(theme_id)
    }

    componentDidMount() {
        let _this = this
        // 声明一个自定义事件
        // 在组件装载完成以后
        _this.eventEmitter = emitter.addListener("refresh-reply-list", (msg)=>{
            // console.log('emitter msg ', msg);
            let theme_id = this.props.theme_id
            _this.setHtml(theme_id)
        });
    }

    render() {
        let _this = this
        let hasReply = _this.state.hasReply ? '' : 'none'
        return (
            <div className={"panel all-reply " + hasReply}>
                <div className="header">
                    <span className="col_fade">回复</span>
                </div>
                <div className="inner">
                    {this.tpl()}
                </div>
            </div>
        );
    }
}

export default ReplyList
