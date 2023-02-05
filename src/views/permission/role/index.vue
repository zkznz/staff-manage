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
            <CommonTable :tableData="table.tableData" :columnOptions="table.columnOptions" :hasSelect="table.hasSelect"
                :hasOperate="table.hasOperate" :pageConfig="table.pageConfig" :height="400" :operateWidth="300">
                <template #slot1="{ data }">
                    <el-button type="warning" size="mini" style="margin-left: 10px;"
                        @click="handleMenu(data)">分配菜单</el-button>
                </template>
            </CommonTable>
        </el-card>
        <!-- 编辑对话框 -->
        <el-dialog :title="dialogForm.type == 'add' ? '新增角色' : '更新角色'" :visible.sync="dialogForm.isShow">
            <CommonForm :formData="dialogForm.formData" :formItemList="dialogForm.formItemList"
                :inline="dialogForm.inline"></CommonForm>
            <div slot="footer">
                <el-button @click="dialogForm.isShow = false" size="mini">取消</el-button>
                <el-button type="primary" @click="confirm" size="mini">确定</el-button>
            </div>
        </el-dialog>
        <!-- 分配菜单对话框 -->
        <el-dialog title="菜单分配" :visible.sync="menuDialog.isShow">
            <el-tree ref="tree" :props="menuDialog.props" :data="menuDialog.menuData" node-key="id" show-checkbox
                default-expand-all :default-checked-keys="menuDialog.leafKeys">
                <template #default="{ node, data }">
                    <span><i :class="'el-icon-' + data.icon"></i> {{ node.label }}</span>
                </template>
            </el-tree>
            <div slot="footer">
                <el-button @click="menuDialog.isShow = false" size="mini">取消</el-button>
                <el-button type="primary" @click="confirmMenu" size="mini">确定</el-button>
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
    setMenu,
    getMenu
} from '../../../api/role'

import { getAll } from "../../../api/menu";
export default {
    name: 'Role',
    components: { CommonForm, CommonTable },
    data() {
        return {
            searchForm: {
                formItemList: [
                    {
                        name: 'name',
                        label: '职称',
                        type: 'input',
                        icon: 'el-icon-search'
                    }
                ],
                formData: {},
                inline: true
            },
            table: {
                tableData: [],
                columnOptions: [
                    { label: '编号', name: 'code' },
                    { label: '职称', name: 'name' },
                    { label: '备注', name: 'remark', width: 200 },
                ],
                pageConfig: {
                    current: 1,
                    size: 10,
                    total: 10
                },
                //控制表格多选框
                hasSelect: true,
                //控制表格操作按钮
                hasOperate: true,
            },
            dialogForm: {
                type: '',
                isShow: false,
                formData: {},
                inline: true,
                formItemList: [
                    { name: 'code', label: '编号', type: 'input' },
                    { name: 'name', label: '职称', type: 'input' },
                    { name: 'remark', label: '备注', type: 'textarea' },
                ]
            },
            menuDialog: {
                isShow: false,
                menuData: [],
                props: {
                    label: 'name'
                },
                //默认选中的节点
                leafKeys: []
            },
            ids: [],
            roleId: 0 // 默认为0
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
        }
    },
    methods: {
        async loading() {
            let res = await getList({
                current: this.table.pageConfig.current,
                size: this.table.pageConfig.size,
                name: this.searchForm.formData.name
            })
            if (res.code == 200) {
                this.table.tableData = res.data.list;
                this.table.pageConfig.total = res.data.total;
            }
        },
        search() {
            this.loading()
        },
        // 重置搜索表单
        reset() {
            this.searchForm.formData.name = ""
            this.loading()
        },
        addData() {
            this.dialogForm.type = 'add';
            this.dialogForm.formData = {};
            this.dialogForm.isShow = true;
        },
        async handleDelete(id) {
            let res = await deleteOne(id);
            if (res.code == 200) {
                this.$message.success("删除成功！");
                this.loading();
            }
            else {
                this.$message.error("删除失败！");
            }
        },
        handleEdit(row) {
            this.dialogForm.type == 'edit';
            this.dialogForm.formData = row;
            this.dialogForm.isShow = true;
        },
        //提交编辑表单
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
            let res = await deleteBatch(this.ids);
            if (res.code == 200) {
                this.$message.success("批量删除成功！");
                this.loading();
            }
            else {
                this.$message.error("批量删除成功！");
            }
        },
        // 导出数据
        exportData() {
            window.open(getExportApi())
        },
        handleSuccess(response) {
            if (response.code === 200) {
                this.$message.success("数据导入成功！")
                this.loading()
            } else {
                this.$message.error("数据导入失败！")
            }
        },
        async handleMenu(data) {
            this.roleId = data.id;
            //获取所有菜单，并将此角色所选择的菜单勾选上
            let res = await getAll()
            this.menuDialog.isShow = true;
            this.menuDialog.leafKeys = [];
            if (res.code == 200) {
                this.menuDialog.menuData = res.data;
                res = await getMenu(this.roleId);
                if (res.code == 200) {
                    let leafKeys = [];
                    res.data.forEach(item => {
                        if (this.$refs.tree.getNode(item.menuId)) {
                            if (this.$refs.tree.getNode(item.menuId).isLeaf)
                                leafKeys.push(item.menuId);
                        }
                    })
                    this.menuDialog.leafKeys = leafKeys;
                }
            }
            else {
                this.$message.error("获取数据失败！")
            }
        },
        //提交分配菜单
        async confirmMenu() {
            console.log("checked:", this.$refs.tree.getCheckedKeys());
            console.log("half", this.$refs.tree.getHalfCheckedKeys());
            let res = await setMenu(this.roleId, this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()));
            if (res.code == 200) {
                this.menuDialog.isShow = false;
                this.$message.success("设置菜单成功！");
            }
            else {
                this.$message.error("设置菜单失败！");
            }
        }
    },
    created() {
        this.loading();
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
        this.$bus.$on("select", val => {
            this.ids = val.map(item => item.id) // [{},{},{}] => [1,2,3]
        })
    },
    beforeDestroy() {
        // 销毁事件
        this.$bus.$off("sizeChange")
        this.$bus.$off("currentChange")
        this.$bus.$off("del")
        this.$bus.$off("edit")
        this.$bus.$off("select")
    }
};
</script>
<style  scoped>

</style>