import React, {Component} from 'react';
import AddTheme from '../../components/add_topic/index'

import './index.css'

class AddThemePage extends React.Component {

    render() {
        return (
            <div className="pannel-add-topic">
                <AddTheme />
            </div>
        );
    }
}

export default AddThemePage;