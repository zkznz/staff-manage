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
        </div>
        <!-- 搜索框 -->
        <CommonForm :formData="searchForm.formData" :formItemList="searchForm.formItemList" :inline="searchForm.inline">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
            <el-button type="danger" icon="el-icon-refresh-left" @click="reset" size="mini">重置</el-button>
        </CommonForm>
        <!-- 表格 -->
        <CommonTable :tableData="table.tableData" :columnOptions="table.columnOptions" :pageConfig="table.pageConfig"
            :height="400">
            <template #tag="{ data }">
                <el-tag size="small" :type="table.tagType[data.status]">{{ data.status }}</el-tag>
            </template>
            <template #operate="{ data }">
                <el-button type="primary" size="mini" icon="el-icon-check" @click="approve(data)"
                    :disabled="data.status != '未审核'">批准</el-button>
                <el-button type="danger" size="mini" icon="el-icon-close" @click="reject(data)"
                    :disabled="data.status != '未审核'">驳回</el-button>
            </template>
        </CommonTable>
    </div>

</template>

<script>
import CommonForm from '../../../components/CommonForm'
import CommonTable from '../../../components/CommonTable.vue'
import {
    getList,
    getImportApi,
    getExportApi,
    edit
} from '../../../api/staffLeave'
export default {
    name: 'Leave',
    components: { CommonForm, CommonTable },
    data() {
        return {
            searchForm: {
                inline: true,
                formData: {},
                formItemList: [
                    {
                        name: 'name',
                        label: '姓名',
                        type: 'input',
                        icon: 'el-icon-search'
                    },
                    {}
                ]
            },
            table: {
                tableData: [],
                tagType: {
                    "未审核": "info",
                    "审核通过": "success",
                    "驳回": "danger"
                },
                columnOptions: [
                    { name: 'code', label: '工号' },
                    { name: 'name', label: '姓名' },
                    { name: 'phone', label: '电话' },
                    { name: 'typeName', label: '类型' },
                    { name: 'startDate', label: '开始日期' },
                    { name: 'days', width: '80', label: '天数' },
                    { name: 'createTime', label: '申请时间', width: '180' },
                    { label: '审核状态', width: '100', columnType: true, slotName: 'tag' },
                    { name: 'remark', label: '备注', width: '200' },
                    { label: '操作', fixed: 'right', width: '200', columnType: true, slotName: 'operate' }
                ],
                pageConfig: {
                    total: 10, // 记录总数
                    current: 1, // 起始页
                    size: 10 // 每页展示的记录数
                }
            }
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
        search() {
            this.loading();
        },
        // 重置搜索表单
        reset() {
            this.searchForm.formData.name = ""
            this.loading();
        },
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
        //批准
        async approve(data) {
            data.status = "审核通过"
            let response = await edit(data)
            if (response.code === 200) {
                this.loading()
                this.$message.success("审批通过")
            }
        },
        //驳回
        async reject(data) {
            data.status = "驳回"
            let response = await edit(data)
            if (response.code === 200) {
                this.loading()
                this.$message.error("驳回");
            }
        }

    },
    created() {
        this.loading()
    },
    mounted() {
        this.$bus.$on("sizeChange", size => {
            this.table.pageConfig.size = size;
            this.loading();
        })
        this.$bus.$on("currentChange", current => {
            this.table.pageConfig.current = current;
            this.loading();
        })

    },
    beforeDestroy() {
        // 销毁事件
        this.$bus.$off("sizeChange");
        this.$bus.$off("currentChange");

    }
};
</script>
<style  scoped>

</style>