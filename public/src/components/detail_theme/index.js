
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { Pagination, message } from 'antd';
import {ajax} from '../../service/ajax';
import ThemeCell from '../cell_theme/index'
import '../../style/index.css';
import './style.css';
import './one-dark.css';
import marked from "marked"

class ThemeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topic_id:'all',
            inner:{},
            is_collect:'收藏'
        }
    }

    async setHtml (theme_id,) {
        let data = await ajax({
            url:`/theme/detail/data/${theme_id}`,
            sync:false,
        })
        let inner = data.data
        if (data.success) {
            this.setState({
                inner:inner,
            })
        }
    }

    componentWillMount () {
        let theme_id =  this.props.theme_id
        console.log('theme_id', theme_id);
        this.setHtml(theme_id)
    }

    componentDidMount() {
        let _this = this

    }
    turnMark (content) {
        let m = marked(content)
        return {__html: m};
    }
    cbThemeColl (r) {
        let _this = this
        let res = JSON.parse(r.response)
        if (res.success) {
            let is_collect = res.data.is_collect ? 1 : 0
            _this.setState({
                inner:{
                    is_collect:is_collect,
                }
            })
            console.log('is_collect', is_collect);
        } else {
            let m = res.message
            message.error(m, 5);
        }
    }
    themeColl () {
        let _this = this
        let data = {
            theme_id:this.props.theme_id,
        }
        ajax({
            method  : 'POST',
            data    : data,
            url    : '/theme/collect',
            callback: _this.cbThemeColl
        })
    }
    render() {
        let _this = this
        let obj = _this.state.inner
        if (obj.userInfo == undefined) {
            return (
                <div className={"no"}>
                    还未渲染
                </div>
            )
        }
        let collect = {
            class:['', 'collect-success'],
            text:['收藏', '取消收藏'],
        }
        let is_collect = obj.is_collect ? 1 : 0
        return (
            <div className={"article-content"}>
                <div className="header theme-header" data-theme_id={obj._id}>
                    <span className="theme-full-title">
                        {obj.title}
                    </span>
                    <div className="changes">
                        <span>发布于 {obj.create_at}</span>
                        <span>作者 <Link to={"/user/" + obj.userInfo.username}>{obj.userInfo.username}</Link></span>
                        <span>{obj.browseInfo.view_num} 次浏览</span>
                        <span> 来自 {obj.topicInfo.cnName}</span>
                        <button
                            className={"button-theme-collect" + collect.class[is_collect]}
                            onClick={_this.themeColl.bind(this)}
                        >
                            {collect.text[is_collect]}
                            </button>
                    </div>
                </div>
                < div className = "inner" >
                    < div className = "theme-content" >
                        < div className = "markdown-body" dangerouslySetInnerHTML={_this.turnMark(obj.content)}>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ThemeList
