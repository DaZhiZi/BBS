import React from 'react'
import ReactDOM from 'react-dom'
import SimpleMDE from "simplemde";
// 引入编辑器以及编辑器样式
//CSS文件路径不能为simplemde/src/simplemdecss,有bug
import 'simplemde/dist/simplemde.min.css';
import './style.css'


class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inner:[],
            value:'',
            editor:{},
        }

    }
    componentDidMount() {
        let _this = this
        this.setState({
            editor : new SimpleMDE({
                element: _this.refs.add_reply_editor,
                spellChecker: false,
                // autofocus:true,
                placeholder:'添加回复',
                renderingConfig:{
                    codeSyntaxHighlighting:true,
                },
                status: false,
            })
        })
    }
    handleChange(e) {
        this.state.editor.codemirror.on("change", function(){
            console.log(this.state.editor.value());
        });
        let v = this.state.editor.value
        this.setState({
            value:v,
        })
    }
    render () {
        return (
            <textarea
                ref='add_reply_editor'
                value={this.state.value}
                onChange={this.handleChange}>
            </textarea>
        )
    }
}

export default Editor;