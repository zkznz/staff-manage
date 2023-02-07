<template>
    <div>
        <!-- 操作 -->
        <div style="margin-bottom: 10px;">
            <el-upload :action="importApi" :headers="headers" accept="xlsx" :multiple="false"
                :on-success="handleSuccess" :show-file-list="false" style="display: inline-block;">
                <el-button size="mini" type="success" icon="el-icon-bottom">导入</el-button>
            </el-upload>
            <el-button type="warning" size="mini" @click="exportData" style="margin-left: 10px" icon="el-icon-top">导出

            </el-button>
            <el-button type="primary" size="mini" @click="addData" style="margin-left: 10px"
                icon="el-icon-circle-plus-outline">新增

            </el-button>
            <el-popconfirm style="margin-left: 10px" confirm-button-text='确定' cancel-button-text='我再想想'
                icon="el-icon-info" icon-color="red" title="你确定删除吗？" @confirm="handleDeleteBatch">
                <el-button type="danger" size="mini" icon="el-icon-remove-outline" slot="reference">批量删除
                </el-button>
            </el-popconfirm>
        </div>
        <!-- 搜索框 -->
        <CommonForm :formData="searchForm.formData" :formItemList="searchForm.formItemList" :inline="searchForm.inline">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
            <el-button type="danger" icon="el-icon-refresh-left" @click="reset" size="mini">重置</el-button>
        </CommonForm>
        <!-- 表格 -->
        <el-card>
            <CommonTable :tableData="table.tableData" :columnOptions="table.columnOptions"
                :pageConfig="table.pageConfig" :height="400" :hasSelect="table.hasSelect" :hasOperate="true"
                :operateWidth="300">
                <template #switch="{ data }">
                    <el-switch style="display: block" v-model="data.status" :active-value="1" :inactive-value="0"
                        active-color="#13ce66" inactive-color="#ff4949" active-text="正常" inactive-text="异常"
                        @change="handleChange(data)">
                    </el-switch>
                </template>
                <template #slot1="{ data }">
                    <el-button style="margin-left: 10px;" size="mini" icon="el-icon-user" type="warning"
                        @click="handleRole(data)">分配角色</el-button>
                </template>
            </CommonTable>
        </el-card>
        <!-- 编辑对话框 -->
        <el-dialog :title="dialogForm.type == 'add' ? '新增用户' : '更新用户'" :visible.sync="dialogForm.isShow">
            <CommonForm :formData="dialogForm.formData" :inline="dialogForm.inline"
                :formItemList="dialogForm.formItemList"></CommonForm>
            <div slot="footer">
                <el-button @click="dialogForm.isShow = false" size="mini">取消</el-button>
                <el-button type="primary" @click="confirm" size="mini">确定</el-button>
            </div>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog title="角色分配" :visible.sync="roleDialog.isShow">
            <el-checkbox-group v-model="roleDialog.checkedList" size="mini">
                <el-checkbox v-for="item in roleDialog.roleData" :label="item.id" :key="item.id" border
                    style="margin: 10px">{{
                        item.name
                    }}</el-checkbox>
            </el-checkbox-group>
            <div slot="footer">
                <el-button @click="roleDialog.isShow = false" size="mini">取消</el-button>
                <el-button type="primary" @click="handleSetRole" size="mini">确定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
import CommonForm from '../../../components/CommonForm'
import CommonTable from '../../../components/CommonTable'
import {
    add,
    getList,
    deleteOne,
    edit,
    deleteBatch,
    getImportApi,
    getExportApi,
    setRole,
    getRole
} from '../../../api/staff'

import { getAll } from "../../../api/role";

import { getAllDept } from "../../../api/dept";
export default {
    name: 'Staff',
    components: { CommonForm, CommonTable },
    data() {
        return {
            searchForm: {
                formData: {},
                formItemList: [
                    {
                        name: 'name',
                        label: '姓名',
                        type: 'input',
                        icon: 'el-icon-search'
                    },
                    {
                        name: 'deptId',
                        label: '部门',
                        type: 'select',
                        optionList: []
                    },
                    {
                        name: 'status',
                        label: '状态',
                        type: 'select',
                        optionList: [
                            {
                                id: 1,
                                name: '正常'
                            },
                            {
                                id: 0,
                                name: '异常'
                            }
                        ]
                    }
                ],
                inline: true
            },
            table: {
                tableData: [],
                columnOptions: [
                    {
                        name: 'code',
                        label: '工号',
                    },
                    {
                        name: 'name',
                        label: '姓名',
                    },
                    {
                        name: 'age',
                        label: '年龄',
                        width: 50
                    },

                    {
                        name: 'deptName',
                        label: '部门',
                    },
                    {
                        name: 'gender',
                        label: '性别',
                        width: 50
                    },
                    {
                        name: 'phone',
                        label: '电话',
                    },
                    {
                        name: 'birthday',
                        label: '生日',
                    },
                    {
                        name: 'status',
                        label: "状态",
                        width: 150,
                        columnType: true,
                        slotName: 'switch'
                    },
                    {
                        name: 'address',
                        label: '地址',
                        width: 200,

                    },
                    {
                        name: 'remark',
                        label: '备注',
                        width: 200
                    }
                ],
                hasSelect: true,
                pageConfig: {
                    total: 10, // 记录总数
                    current: 1, // 起始页
                    size: 10 // 每页展示的记录数
                },
            },
            dialogForm: {
                type: '',
                isShow: false,
                inline: true,
                formData: {},
                formItemList: [
                    {
                        name: 'name',
                        label: '姓名',
                        type: 'input',
                    },
                    {
                        name: 'deptId',
                        label: '部门',
                        type: 'select',
                        optionList: []
                    },
                    {
                        name: 'gender',
                        label: '性别',
                        type: 'select',
                        optionList: [
                            {
                                name: '男',
                                id: 0
                            },
                            {
                                name: '女',
                                id: 1
                            }
                        ]
                    },
                    {
                        name: 'birthday',
                        label: '生日',
                        type: 'date'
                    },
                    {
                        name: 'phone',
                        label: '电话',
                        type: 'input'
                    },
                    {
                        name: 'address',
                        label: '地址',
                        type: 'input'
                    },
                    {
                        name: 'remark',
                        label: '备注',
                        type: 'textarea'
                    }
                ],

            },
            roleDialog: {
                isShow: false,
                roleData: [],
                //已选择的角色
                checkedList: []
            },
            ids: [],
            staffId: 0, // 默认为0
        };
    },
    computed: {
        // 获取导入数据的接口
        importApi() {
            return getImportApi()
        },
        headers() {
            return {
                token: localStorage.getItem("token")
            }
        },
    },
    methods: {
        //获取所有部门
        async getDept(form) {
            let res = await getAllDept();
            if (res.code = 200) {
                form.formItemList.forEach(item => {
                    //获取下拉列表
                    if (item.name == 'deptId') {
                        let list = [];
                        res.data.forEach(dept => {
                            if (dept.children.length > 0) {
                                dept.disabled = true;
                                list.push(dept);
                                dept.children.forEach(subDept => {
                                    list.push(subDept);
                                })
                            }
                        })
                        item.optionList = list;
                    }
                })
            }

        },
        async loading() {
            this.getDept(this.searchForm);
            let res = await getList({
                current: this.table.pageConfig.current,
                size: this.table.pageConfig.size,
            }, this.searchForm.formData);
            if (res.code == 200) {
                this.table.tableData = res.data.list;
                this.table.pageConfig.total = res.data.total;
            }
        },
        exportData() {
            window.open(getExportApi());
        },
        addData() {
            this.dialogForm.type = 'add';
            this.getDept(this.dialogForm);
            this.dialogForm.formData = {};
            this.dialogForm.isShow = true;
        },
        async confirm() {
            if (this.dialogForm.type == 'add') {
                let res = await add(this.dialogForm.formData);
                if (res.code == 200) {
                    this.$message.success("添加成功！");
                    this.dialogForm.isShow = false;
                    this.loading();
                }
                else {
                    this.$message.error("添加失败！");
                }
            }
            else {
                let res = await edit(this.dialogForm.formData);
                if (res.code == 200) {
                    this.$message.success("修改成功！");
                    this.dialogForm.isShow = false;
                    this.loading();
                }
                else {
                    this.$message.error("修改失败！");
                }
            }
        },
        async handleDeleteBatch() {
            let response = await deleteBatch(this.ids)
            if (response.code === 200) {
                this.$message.success("批量删除成功！");
                this.loading();
            } else {
                this.$message.error("批量删除失败！");
            }
        },
        search() {
            this.loading();
        },
        // 重置搜索表单
        reset() {
            this.searchForm.formData = {};
            this.loading();
        },
        handleEdit(row) {
            this.dialogForm.type = 'edit';
            this.dialogForm.formData = row;
            this.getDept(this.dialogForm);
            this.dialogForm.isShow = true;

        },
        async handleDelete(id) {
            let response = await deleteOne(id)

            if (response.code === 200) {
                this.$message.success("删除成功！");
                this.loading();
            } else {
                this.$message.error("删除失败！");
            }

        },
        handleSuccess(response) {
            if (response.code === 200) {
                this.$message.success("数据导入成功！");
                this.loading();
            } else {
                this.$message.error("数据导入失败！");
            }
        },
        //表格员工状态发生改变
        handleChange(data) {
            try {
                edit(data);
            } catch (error) {
                new Promise.reject(new Error(error));
            }
        },
        //点击角色分配按钮
        async handleRole(data) {
            this.staffId = data.id;
            let res = await getAll();
            if (res.code == 200) {
                this.roleDialog.roleData = res.data;
            }
            else {
                this.$message.error("获取角色数据失败！");
            }
            //获取已选择的角色
            res = await getRole(this.staffId);
            if (res.code == 200) {
                this.roleDialog.checkedList = res.data.map(item => item.id);
            }
            else {
                this.$message.error("获取数据失败！")
            }
            this.roleDialog.isShow = true;
        },
        //提交角色分配表单
        async handleSetRole() {
            let res = await setRole(this.staffId, this.roleDialog.checkedList);
            if (res.code == 200) {
                this.roleDialog.isShow = false;
                this.$message.success("角色分配成功！");
            }
            else {
                this.$message.error("角色分配失败！")
            }
        }
    },
    created() {
        this.loading()
    },
    mounted() {
        this.$bus.$on("sizeChange", size => {
            this.table.pageConfig.size = size
            this.loading()
        })
        this.$bus.$on("currentChange", current => {
            this.table.pageConfig.current = current
            this.loading()
        })
        this.$bus.$on("del", row => {
            this.handleDelete(row.id)
        })
        this.$bus.$on("edit", row => {
            this.handleEdit(row)
        })
        this.$bus.$on("selectionChange", val => {
            this.ids = val.map(item => item.id) // [{},{},{}] => [1,2,3]
        })
    },
    beforeDestroy() {
        // 销毁事件
        this.$bus.$off("sizeChange")
        this.$bus.$off("currentChange")
        this.$bus.$off("del")
        this.$bus.$off("edit")
        this.$bus.$off("selectionChange")
    }
};
</script>
<style  scoped>

</style>