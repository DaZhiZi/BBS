//app/public/src/pages/all/index.js

import React, {Component} from 'react';
import {Button, Table, Modal} from 'antd'
//子组件
import EditModal from './edit'

const confirm = Modal.confirm;

class All extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editVisiable: false,
            dataSource: [],
            editDataObj: {},
        }
    }

//删除
    deleteHandle = (record) => {
        confirm({
            title: `您确定要删除?(${record.key})`,
            onOk: () => {
                this.updateDataHandle({
                    key: record.key,
                    status: -1,
                })
            },
        });
    }

//修改
    updateDataHandle = (values) => {
        const {dataSource} = this.state
        const id = values.key
        const status = values.status || 0

        const index = dataSource.findIndex(e => e.key === id)

        //替换
        if (status >= 0) {
            let replace = dataSource.splice(index, 1, values)
        } else {
            //删除
            let removed = dataSource.splice(index, 1)
        }


        this.setState({
            dataSource: dataSource,
        })
    }
    editHandle = (record) => {
        //record 为 当前行数据
        //将当前行数据传递给EditModal组件展示
        this.setState({
            editVisiable: true,
            editDataObj: record,
        })
    }

    //显示弹窗
    addDataSource = () => {
        this.setState({
            editVisiable: true,
            editDataObj: {},
        })
    }
    //取消弹窗
    onModelCancel = () => {
        this.setState({
            editVisiable: false,
        })
    }
    //储存数据
    saveData = (updateData) => {

        const {dataSource} = this.state
        dataSource.push(updateData)

        this.setState({
            dataSource: dataSource,
        })

    }

    render() {
        // editVisiable控制弹窗显示, dataSource为tabale渲染的数据
        const {editVisiable, dataSource, editDataObj} = this.state
        return (
            <div className="content-inner">
                <Button className='button-new-data' type='primary' onClick={this.addDataSource}> 新建数据</Button>
                <Table
                    columns={this.columns}
                    dataSource={dataSource}
                />
                <EditModal
                    editVisiable={editVisiable}
                    updateDataHandle={this.updateDataHandle}
                    onModelCancel={this.onModelCancel}
                    saveData={this.saveData}
                    editDataObj={editDataObj}
                />
            </div>
        );
    }

//定义表格
    columns = [{
        title: 'id',
        dataIndex: 'key',
        key: 'key',
    }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    }, {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
    }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
            <div style={{textAlign: 'ceter'}}>
                <a href="javascript:void(0)" style={{marginRight: '10px'}}
                   onClick={() => this.editHandle(record)}
                >编辑</a>
                <a href="javascript:void(0)" style={{marginRight: '10px'}}
                   onClick={() => this.deleteHandle(record)}
                >删除</a>
            </div>
        ),
    }];

}

export default All;
