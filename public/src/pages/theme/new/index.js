import React, {Component} from 'react';
import AddTheme from '../../../components/add_theme/index'

import './index.css'

class AddThemePage extends React.Component {

    render() {
        return (
            <div className="pannel-add-theme">
                <AddTheme />
            </div>
        );
    }
}

export default AddThemePage;