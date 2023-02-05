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
                <template #slot1="{ data }">
                    <el-button style="margin-left: 10px;" type="warning" icon="el-icon-circle-plus-outline"
                        @click="handleSubAdd(data)" size="mini">新增</el-button>
                </template>
            </CommonTable>
        </el-card>
        <!-- 对话框 -->
        <el-dialog :title="dialogForm.type == 'add' ? '新增菜单' : '更新菜单'" :visible.sync="dialogForm.isShow">
            <CommonForm :formItemList="dialogForm.formItemList" :formData="dialogForm.formData"
                :inline="dialogForm.inline"></CommonForm>
            <div slot="footer">
                <el-button @click="dialogForm.isShow = false" size="mini">取消</el-button>
                <el-button type="primary" @click="confirm" size="mini">确定</el-button>
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
    getExportApi
} from '../../../api/menu'
export default {
    name: 'Menu',
    components: { CommonForm, CommonTable },
    data() {
        return {
            searchForm: {
                isShow: false,
                inline: true,
                formData: {},
                formItemList: [
                    { type: 'input', label: '名称', name: 'name', icon: 'el-icon-search' }
                ]
            },
            table: {
                tableData: [],
                columnOptions: [
                    {
                        name: 'code',
                        label: '编号',

                    },
                    {
                        name: 'name',
                        label: '名称',

                    },
                    {
                        name: 'icon',
                        label: '图标',

                    },
                    {
                        name: 'path',
                        label: '路径',

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
                }
            },
            dialogForm: {
                type: '',
                isShow: false,
                inline: true,
                formData: {},
                formItemList: [
                    {
                        name: 'code',
                        label: '编号',
                        type: 'input'
                    },
                    {
                        name: 'name',
                        label: '名称',
                        type: 'input'
                    },
                    {
                        name: 'icon',
                        label: '图标',
                        type: 'input'
                    },
                    {
                        name: 'path',
                        label: '路径',
                        type: 'input'
                    },
                    {
                        name: 'remark',
                        label: '备注',
                        type: 'textarea'
                    }
                ]
            },
            ids: []
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
            });
            if (res.code == 200) {
                this.table.tableData = res.data.list;
                this.table.pageConfig.total = res.data.total;
            }
            else {
                this.$message("获取数据失败！");
            }
        },
        addData() {
            this.dialogForm.type = 'add';
            this.dialogForm.formData = {};
            this.dialogForm.isShow = true;
        },
        //添加子菜单
        handleSubAdd(data) {
            this.dialogForm.type = 'add';
            this.dialogForm.formData = { parentId: data.id };
            this.dialogForm.isShow = true;
        },
        async confirm() {
            if (this.dialogForm.type == 'add') {
                let res = await add(this.dialogForm.formData);
                if (res.code == 200) {
                    this.$message.success("添加成功！")
                    this.dialogForm.isShow = false
                    this.loading()
                }
                else {
                    this.$message.error("添加失败！")
                }
            }
            else {
                let response = await edit(this.dialogForm.formData)
                if (response.code === 200) {
                    this.$message.success("修改成功！")
                    this.dialogForm.isShow = false
                    this.loading()
                } else {
                    this.$message.error("修改失败！")
                }

            }
        },

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
        search() {
            this.loading()
        },
        // 重置搜索表单
        reset() {
            this.searchForm.formData.name = ""
            this.loading()
        },
        handleEdit(row) {
            this.dialogForm.type = 'edit';
            this.dialogForm.formData = row;
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