import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ajax, uploadFile} from '../../service/ajax';
import {Upload, Icon, Modal, Button} from 'antd';
import {message} from "antd/lib/index";

class ChangeUserinfo extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };

    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({fileList}) => this.setState({fileList})

    changeAvatar(e) {
        let file = this.state.fileList[0]
        uploadFile(file, '/user/avatar', function (r) {
            let res = JSON.parse(r)
            let m = res.message
            if (res.success == true) {
                message.success(m, 10)
            } else {
                message.error(m, 5);
            }
        })
    }

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        let UploadProps = {
            beforeUpload: () => false,
            action: "/user/avatar",
            listType: "picture-card",
            name: "avatar",
            fileList: fileList,
            onPreview: this.handlePreview,
            onChange: this.handleChange,
        }
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div className="panel">
                <div className="header">
                    更改用户信息
                </div>
                <div className="inner">
                    <div className="avatar">
                        <div className="clearfix">
                            <Upload {...UploadProps} >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="预览图" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                        </div>
                        <Button type="primary"
                                onClick={this.changeAvatar.bind(this)}
                        >
                            更改头像
                        </Button>
                    </div>
                </div>
            </div>

        );
    }
}

export default ChangeUserinfo