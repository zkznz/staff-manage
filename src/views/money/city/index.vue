<template>
    <div>
        <!-- 操作 -->
        <div style="margin-bottom: 10px;">
            <el-upload :action="importApi" :headers="header" accept="xlsx" :multiple="false" :on-success="handleSuccess"
                :show-file-list="false" style="display: inline-block;">
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
            <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
            <el-button type="danger" icon="el-icon-refresh-left" @click="reset" size="mini">重置</el-button>
        </CommonForm>
        <!-- 表格 -->
        <el-card>
            <CommonTable :tableData="table.tableData" :columnOptions="table.columnOptions" :height="table.height"
                :pageConfig="table.pageConfig" :hasSelect="table.hasSelect" :hasOperate="table.hasOperate">
            </CommonTable>
        </el-card>
        <!-- 对话框 -->
        <el-dialog :title="dialogForm.type === 'add' ? '新增城市社保信息' : '更新城市社保信息'" :visible.sync="dialogForm.isShow">
            <CommonForm :formData="dialogForm.formData" :formItemList="dialogForm.formItemList"
                :rules="dialogForm.rules" ref="dialogForm"></CommonForm>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogForm.isShow = false" size="small">取消</el-button>
                <el-button type="primary" @click="confirm" size="small">确定</el-button>
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
} from '../../../api/city'
export default {
    name: 'City',
    components: { CommonForm, CommonTable },
    data() {
        let checkAverageSalary = (rule, value, callback) => {
            if (value < this.dialogForm.formData.lowerSalary) {
                callback(new Error("不低于职工上年度最低月工资！"))
            } else {
                callback()
            }
        }
        return {
            //搜索框
            searchForm: {
                formData: {},
                formItemList: [
                    { type: 'input', name: 'name', label: '城市名称', icon: 'el-icon-search' }
                ],
                inline: true
            },
            table: {
                tableData: [],
                height: 400,
                columnOptions: [
                    {
                        name: 'name',
                        label: '城市名称'
                    },
                    {
                        name: 'socUpperLimit',
                        label: '职工社保缴纳基数上限', width: 150
                    },

                    {
                        name: 'socLowerLimit',
                        label: '职工社保缴纳基数下限',
                        width: 150
                    },
                    {
                        name: 'houUpperLimit',
                        label: '公积金缴纳基数上限',
                        width: 150
                    },
                    {
                        name: 'houLowerLimit',
                        label: '公积金缴纳基数下限',
                        width: 150
                    },
                    {
                        name: 'perPensionRate',
                        label: '养老保险个人缴费比例',
                        width: 150
                    },
                    {
                        name: 'comPensionRate',
                        label: '养老保险企业缴费比例',
                        width: 150
                    },
                    {
                        name: 'perMedicalRate',
                        label: '医疗保险个人缴费比例',
                        width: 150
                    },
                    {
                        name: 'comMedicalRate',
                        label: '医疗保险企业缴费比例',
                        width: 150
                    },
                    {
                        name: 'perUnemploymentRate',
                        label: '失业保险个人缴费比例',
                        width: 150
                    },
                    {
                        name: 'comUnemploymentRate',
                        label: '失业保险企业缴费比例',
                        width: 150
                    },
                    {
                        name: 'comMaternityRate',
                        label: '生育保险企业缴费比例',
                        width: 150
                    }
                ],
                pageConfig: {
                    total: 10, // 记录总数
                    current: 1, // 起始页
                    size: 10 // 每页展示的记录数
                },
                hasSelect: true,
                hasOperate: true
            },
            dialogForm: {
                isShow: false,
                type: '',
                formData: {},
                formItemList: [
                    {
                        name: 'name',
                        label: '城市名称',
                        type: 'input'
                    },
                    {
                        name: 'lowerSalary',
                        label: '职工上年度最低月工资',
                        type: 'number',

                    },
                    {
                        name: 'averageSalary',
                        label: '职工上年度平均月工资',
                        type: 'number',

                    },
                    {
                        name: 'socUpperLimit',
                        label: '职工社保缴纳基数上限',
                        type: 'number',

                        disabled: true
                    },
                    {
                        name: 'socLowerLimit',
                        label: '职工社保缴纳基数下限',

                        type: 'number',
                        disabled: true
                    },
                    {
                        name: 'houUpperLimit',
                        label: '公积金缴纳基数上限',
                        type: 'number',

                        disabled: true
                    },
                    {
                        name: 'houLowerLimit',
                        label: '公积金缴纳基数下限',
                        type: 'number',

                        disabled: true
                    },
                    {
                        name: 'perPensionRate',
                        label: '养老保险个人缴费比例',
                        type: 'number',

                        step: 0.001
                    },
                    {
                        name: 'comPensionRate',
                        label: '养老保险企业缴费比例',
                        type: 'number',

                        step: 0.001
                    },
                    {
                        name: 'perMedicalRate',
                        label: '医疗保险个人缴费比例',
                        type: 'number',

                        step: 0.001
                    },
                    {
                        name: 'comMedicalRate',
                        label: '医疗保险企业缴费比例',
                        type: 'number',

                        step: 0.001
                    },
                    {
                        name: 'perUnemploymentRate',
                        label: '失业保险个人缴费比例',
                        type: 'number',

                        step: 0.001
                    },
                    {
                        name: 'comUnemploymentRate',
                        label: '失业保险企业缴费比例',
                        type: 'number',

                        step: 0.001
                    },
                    {
                        name: 'comMaternityRate',
                        label: '生育保险企业缴费比例',
                        type: 'number',

                        step: 0.001
                    }
                ],
                rules: {
                    name: [
                        { required: true, message: '请输入城市名称', trigger: 'blur' },
                    ],
                    lowerSalary: [
                        { required: true, message: '请输入职工上年度平均月工资', trigger: 'blur' },
                        { type: 'number', min: 500, message: '不低于500元', trigger: 'blur' }
                    ],
                    averageSalary: [
                        { required: true, message: '请输入职工上年度最低月工资', trigger: 'blur' },
                        { validator: checkAverageSalary, trigger: 'blur' }
                    ],
                    perPensionRate: [
                        { required: true, message: '请输入养老保险个人缴纳比例', trigger: 'blur' },
                        { type: 'number', min: 0, max: 1, message: '缴纳比例：0 ~ 1', trigger: 'blur' }
                    ],
                    comPensionRate: [
                        { required: true, message: '请输入养老保险企业缴纳比例', trigger: 'blur' },
                        { type: 'number', min: 0, max: 1, message: '缴纳比例：0 ~ 1', trigger: 'blur' }
                    ],
                    perMedicalRate: [
                        { required: true, message: '请输入医疗保险个人缴纳比例', trigger: 'blur' },
                        { type: 'number', min: 0, max: 1, message: '缴纳比例：0 ~ 1', trigger: 'blur' }
                    ],
                    comMedicalRate: [
                        { required: true, message: '请输入医疗保险企业缴纳比例', trigger: 'blur' },
                        { type: 'number', min: 0, max: 1, message: '缴纳比例：0 ~ 1', trigger: 'blur' }
                    ],
                    perUnemploymentRate: [
                        { required: true, message: '请输入失业保险个人缴纳比例', trigger: 'blur' },
                        { type: 'number', min: 0, max: 1, message: '缴纳比例：0 ~ 1', trigger: 'blur' }
                    ],
                    comUnemploymentRate: [
                        { required: true, message: '请输入失业保险企业缴纳比例', trigger: 'blur' },
                        { type: 'number', min: 0, max: 1, message: '缴纳比例：0 ~ 1', trigger: 'blur' }
                    ],
                    comMaternityRate: [
                        { required: true, message: '请输入生育保险企业缴纳比例', trigger: 'blur' },
                        { type: 'number', min: 0, max: 1, message: '缴纳比例：0 ~ 1', trigger: 'blur' }
                    ]
                }
            }
        };
    },
    computed: {
        // 获取导入数据的接口
        importApi() {
            return getImportApi()
        },
        header() {
            return {
                token: localStorage.getItem("token")
            }
        }
    },
    watch: {
        'dialogForm.formData.averageSalary'() {
            this.dialogForm.formData.socUpperLimit = 3 * this.dialogForm.formData.averageSalary
            this.dialogForm.formData.socLowerLimit = 0.6 * this.dialogForm.formData.averageSalary
            this.dialogForm.formData.houUpperLimit = 3 * this.dialogForm.formData.averageSalary
        },
        'dialogForm.formData.lowerSalary'(newVal) {
            this.dialogForm.formData.houLowerLimit = newVal;
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
                this.table.pageConfig.total = res.data.total
            }
        },
        handleSuccess(response) {
            if (response.code === 200) {
                this.$message.success("数据导入成功！")
                this.loading()
            } else {
                this.$message.error("数据导入失败！")
            }
        },
        exportData() {
            window.open(getExportApi());
        },
        //新增城市社保信息
        addData() {
            this.dialogForm.type = 'add';
            this.dialogForm.isShow = true;
            this.dialogForm.formData = {}
        },
        //批量删除
        async handleDeleteBatch() {
            let res = await deleteBatch(this.ids);
            if (res.code == 200) {
                this.$message("批量删除成功！");
                this.loading();
            }
            else {
                this.$message("批量删除失败！");
            }
        },
        serach() {
            this.loading();
        },
        reset() {
            this.searchForm.formData.name = '';
            this.loading();
        },
        confirm() {
            this.$refs.dialogForm.$refs.form.validate(async valid => {
                if (valid) {
                    if (this.dialogForm.type == 'add') {
                        let res = await add(this.dialogForm.formData);
                        if (res.code == 200) {
                            this.$message.success("添加成功");
                            this.dialogForm.isShow = false;
                            this.loading();
                        }
                        else {
                            this.$message.error("添加失败");
                        }
                    }
                    else {
                        let res = await edit(this.dialogForm.formData);
                        if (res.code == 200) {
                            this.$message.success("修改成功");
                            this.dialogForm.isShow = false;
                            this.loading();
                        }
                        else {
                            this.$message.error("修改失败");
                        }
                    }
                }
            })
        },
        handleEdit(row) {
            this.dialogForm.type = 'edit';
            this.dialogForm.isShow = true;
            this.dialogForm.formData = row;
        },
        async handleDel(row) {
            let res = await deleteOne(row.id);
            if (res.code == 200) {
                this.$message("删除成功！");
                this.loading();
            }
            else {
                this.$message("删除失败！");
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
        this.$bus.$on("edit", row => this.handleEdit(row));
        this.$bus.$on("del", row => this.handleDel(row));
        this.$bus.$on("select", val => {
            this.ids = val.map(item => item.id);
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