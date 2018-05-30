
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { Pagination } from 'antd';
import {ajax} from '../../service/ajax';
import ThemeCell from '../cell_theme/index'


import './style.css';

import emitter from "../../tool/events"

class ThemeList extends Component {
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
        }
    }

    tpl () {
        // 调用两次
        // console.count('tpl');
        let url = this.state.inner.map(function (obj) {
            return <ThemeCell data={obj} key={obj._id}/>
        })
        return url
    }

    async setHtml (topic_id, page=1) {
        let data = await ajax({
            url:`/theme/topic/${topic_id}?page=${page}`,
            sync:false,
        })
        let res = data
        let pageInfo = res.data.page
        pageInfo.pageNum = parseInt(pageInfo.pageNum)
        let inner = res.data.theme
        if (res.success) {
            this.setState({
                inner:inner,
                pagination:{
                    current:pageInfo.pageNum,
                    total:pageInfo.totalNum,
                    pageSize:pageInfo.pageTotal,
                },
            })

        }
    }

    componentWillMount () {
        let topic_id = this.state.topic_id
        this.setHtml(topic_id)
    }

    componentDidMount() {
        let _this = this
        // 声明一个自定义事件
        // 在组件装载完成以后
        _this.eventEmitter = emitter.addListener("topic_id", (msg)=>{
            // console.log('emitter msg ', msg);
            let topic_id = msg
            _this.setHtml(topic_id)
        });
    }

    // 组件销毁前移除事件监听
    // componentWillUnmount(){
    //     emitter.removeListener("topic_id", ()=>{});
    // }
    switchPage (e) {
        let topic_id = document.querySelector('.topic-tab.topic-current').dataset.topicid
        // console.log('this switchPage', this);
        this.setHtml(topic_id, e)
    }
    render() {
        let _this = this
        let {current, total, pageSize} = this.state.pagination

        return (
            <div className='theme-all'>
                <div className="theme-list">
                    {this.tpl()}
                </div>
                <div className="content-footer">
                    <Pagination onChange={_this.switchPage.bind(this)} defaultCurrent={current} defaultPageSize={pageSize} total={total} />
                </div>
            </div>
        );
    }
}

export default ThemeList
