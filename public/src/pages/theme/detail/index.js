import React, {Component} from 'react';
import './index.css';

import ThemeDetail from '../../../components/detail_theme/index'
import ReplyList from '../../../components/list_reply/index'
import ReplyAdd from '../../../components/add_reply/index'


class Index extends Component {
    render() {
        let _this = this
        let theme_id = _this.props.match.params.theme_id
        return (
            <div className="main-content">
                <div className="content">
                    <div className="panel theme-main">
                        <ThemeDetail theme_id={theme_id}/>
                    </div>

                    <ReplyList theme_id={theme_id}/>

                    <ReplyAdd theme_id={theme_id}/>

                </div>

                <div className="slide">

                </div>

            </div>
        );
    }
}

export default Index;
