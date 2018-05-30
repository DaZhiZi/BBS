import React, {Component} from 'react';
import './index.css';

import TopicList from '../../components/list_topic/index'
import ThemeList from '../../components/list_theme/index'
import NoReply from '../../components/noreply/index'


class Index extends Component {
    render() {
        return (
            <div className="main-content">
                <div className="content">
                    <div className="panel ">
                        <div className="header">
                            <TopicList/>
                        </div>
                        <div className="inner theme-inner">
                            <ThemeList />
                        </div>
                    </div>
                </div>
                <div className="slide">
                    <NoReply/>
                </div>
            </div>
        );
    }
}

export default Index;
