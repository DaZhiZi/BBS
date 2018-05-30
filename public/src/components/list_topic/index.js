
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ajax} from '../../service/ajax';

import '../../style/index.css';
import './style.css';
import emitter from "../../tool/events"

class TopicList extends Component {
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
        let _this = this
        let url = _this.state.inner.map(function (obj) {
            return <span data-topicid={obj._id} className={"topic-tab " + obj.enName} key={obj._id}   onClick={_this.changeTopic}>{obj.cnName}</span>
        })
        return url
    }
    changeTopic(e) {
        let target = e.target
        let topic_id = target.dataset.topicid
        let es = document.querySelectorAll('.topic-list .topic-tab')
        for (var i = 0; i < es.length; i++) {
            let ele = es[i]
            ele.classList.remove('topic-current')
        }

        target.classList.add('topic-current')
        // 触发自定义事件
        emitter.emit("topic_id", topic_id)
        // console.log('e', topic_id);
    }
    async componentWillMount() {
        let data = await ajax({
            url:'/topic/all',
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
        let _this = this
        return (
            <div className={'topic-list'}>
                <span data-topicid="all" className="topic-tab topic-current" onClick={_this.changeTopic}>全部</span>
                {this.tpl()}
            </div>
        );
    }
}

export default TopicList
