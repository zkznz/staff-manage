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
            <CommonTable :tableData="table.tableData" :columnOptions="table.columnOptions" :hasOperate="true"
                :height="400" :hasSelect="table.hasSelect" :pageConfig="table.pageConfig"></CommonTable>
        </el-card>
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
} from '../../../api/dept'

import {
    getOne, setWorkTime
} from '../../../api/workTime'

import {
    getAll
} from '../../../api/leaveType'

import {
    getLeave, setLeave
} from '../../../api/leave'

import {
    getAll as getAllDeductTypes
} from '../../../api/deductType'

import {
    getSalaryDeduct, setSalaryDeduct
} from "../../../api/salaryDeduct"

import {
    getAll as getAllOvertimeTypes
} from "../../../api/overtimeType"

import {
    getOvertime, setOvertime
} from "../../../api/overtime";
export default {
    name: 'Department',
    components: { CommonForm, CommonTable },
    data() {
        return {
            searchForm: {

                isShow: false,
                inline: true,
                formData: {},
                formItemList: [
                    {
                        name: 'name',
                        label: '名称',
                        type: 'input',
                        icon: 'el-icon-search'
                    }
                ]
            },
            table: {
                tableData: [],
                columnOptions: [
                    {
                        name: 'name',
                        label: '名称'
                    },
                    {
                        name: 'createTime',
                        label: '成立时间',
                    },
                    {
                        name: 'morStartTime',
                        label: '上午上班时间'
                    },
                    {
                        name: 'morEndTime',
                        label: '上午下班时间'
                    },
                    {
                        name: 'aftStartTime',
                        label: '下午上班时间'
                    },
                    {
                        name: 'aftEndTime',
                        label: '下午下班时间'
                    },
                    {
                        name: 'totalWorkTime',
                        label: '工作时长（h）'
                    },
                    {
                        name: 'remark',
                        label: '备注',
                        width: 200
                    }
                ],
                pageConfig: {
                    total: 10, // 记录总数
                    current: 1, // 起始页
                    size: 10 // 每页展示的记录数
                },
                hasSelect: true,
            }
        };
    },
    computed: {
        // 获取导入数据的接口
        importApi() {
            return getImportApi();
        },
        headers() {
            return {
                token: localStorage.getItem("token")
            }
        },
    },
    methods: {
        async loading() {
            let res = await getList();
            if (res.code == 200) {
                this.table.tableData = res.data.list;
                this.table.pageConfig.total = res.data.total;
            }
        },
        exportData() {
            window.open(getExportApi());
        },
        handleSuccess(response) {
            if (response.code === 200) {
                this.$message.success("数据导入成功！");
                this.loading();
            } else {
                this.$message.error("数据导入失败！");
            }
        },
        handleDeleteBatch() {

        },
        addData() {
            this.dialogForm.type = 'add';
            this.getDept(this.dialogForm);
            this.dialogForm.formData = {};
            this.dialogForm.isShow = true;
        },
        search() {
            this.loading();
        },
        // 重置搜索表单
        reset() {
            this.searchForm.formData = {};
            this.loading();
        },
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