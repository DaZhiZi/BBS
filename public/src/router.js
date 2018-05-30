
import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

// 常驻组件
import Header from './components/header/header';
import { BackTop } from 'antd';
// page组件
import Index from './pages/index';
import All from './pages/all/index';
import Detail from './pages/theme/detail/index';
import AddThemePage from './pages/theme/new/index';
import LoginPage from './pages/login/index';
import Admin from './pages/admin/index';
import User from './pages/user/index';
// 样式
import 'antd/dist/antd.css';
import './style/index.css'

export default () => (
    <BrowserRouter >
        <div>
            <div>
                <Header/>
                <div className='main-contains' >
                    <Switch>
                        <Route exact path="/" component={Index}/>
                        <Route exact path="/all" component={All}/>
                        <Route exact path="/theme/detail/:theme_id" component={Detail}/>
                    </Switch>
                </div>
                <BackTop visibilityHeight={200}/>
            </div>
            <Route  path="/login" component={LoginPage}/>
            <Route exact path="/theme/new" component={AddThemePage}/>
            <Route exact path="/admin" component={Admin}/>
            <Route exact path="/user/:user_id" component={User}/>
        </div>
    </BrowserRouter >
);
