<template>
    <div>
        <!-- 顶部操作 -->
        <div>
            <el-upload :action="importApi" :headers="headers" accept="xlsx" :multiple="false"
                :on-success="handleSuccess" :show-file-list="false" style="display: inline-block;">
                <el-button size="mini" type="success" icon="el-icon-bottom">导入</el-button>
            </el-upload>
            <el-button type="warning" size="mini" @click="exportData" style="margin-left: 10px" icon="el-icon-top">导出

            </el-button>
        </div>
        <!-- 搜索框 -->
        <CommonForm :formItemList="searchForm.formItemList" :formData="searchForm.formData" :inline="searchForm.inline"
            style="margin-top: 10px;">
            <el-button size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button size="mini" type="danger" icon="el-icon-refresh-left" @click="reset">重置</el-button>
        </CommonForm>
        <!-- 表格 -->
        <el-card>
            <el-table height="400" :data="table.tableData" border stripe :header-cell-style="{
                background: '#eef1f6', color: '#606266',
                textAlign: 'center', fontWeight: 'bold', border: '1px solid #ccc', padding: 0
            }">
                <el-table-column label="工号" prop="code" min-width="125"></el-table-column>
                <el-table-column label="姓名" prop="name" min-width="125"></el-table-column>
                <el-table-column label="部门" prop="deptName" min-width="125"></el-table-column>
                <el-table-column label="电话" prop="phone" min-width="125"></el-table-column>
                <el-table-column label="扣款项目">
                    <el-table-column prop="lateDeduct" label="迟到（50￥/次）" min-width="125" />
                    <el-table-column prop="leaveEarlyDeduct" label="早退（50￥/次）" min-width="125" />
                    <el-table-column prop="absenteeismDeduct" label="旷工（100￥/次）" min-width="125" />
                    <el-table-column prop="leaveDeduct" label="请假（80￥/天）" min-width="125" />
                </el-table-column>
                <el-table-column label="缴纳项目">
                    <el-table-column prop="housePay" label="公积金" min-width="125" />
                    <el-table-column prop="socialPay" label="社保" min-width="125" />
                </el-table-column>
                <el-table-column label="实发工资">
                    <el-table-column prop="baseSalary" label="基础工资" min-width="125" />
                    <el-table-column prop="subsidy" label="生活补贴" min-width="125" />
                    <el-table-column prop="bonus" label="奖金" min-width="125" />
                </el-table-column>
                <el-table-column prop="totalSalary" label="最终工资" min-width="125" />
                <el-table-column prop="remark" label="备注" min-width="200" />
                <el-table-column label="操作" width="120" fixed="right">
                    <template v-slot="{ row }">
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                            @click="handleEdit(row)">明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="->,total,sizes,prev,pager,next,jumper"
                :page-size="table.pageConfig.size ? table.pageConfig.size : 10" :page-sizes="[5, 10, 15, 20]"
                :total="table.pageConfig.total" :current-page.sync="table.pageConfig.current"
                @size-change="handleSizeChange" @current-change="handleCurrentChange"
                style="margin-top: 10px;"></el-pagination>
        </el-card>
        <!-- 对话框 -->
        <el-dialog title="工资" :visible.sync="dialogForm.isShow">
            <el-form :model="dialogForm.formData" size="mini" label-width="150px" ref="form" :rules="dialogForm.rules">
                <el-form-item label="基本工资" prop="baseSalary">
                    <el-input-number v-model="dialogForm.formData.baseSalary" :min="0" style="width:48%"
                        :precision="3" />
                </el-form-item>
                <el-form-item label="生活补贴" prop="subsidy">
                    <el-input-number v-model="dialogForm.formData.subsidy" :min="0" style="width:48%" :precision="3" />
                </el-form-item>
                <el-form-item label="奖金" prop="bonus">
                    <el-input-number v-model="dialogForm.formData.bonus" :min="0" style="width:48%" :precision="3" />
                </el-form-item>
                <el-form-item label="扣款">
                    <el-col :span="8">
                        <el-form-item label="迟到" label-width="60px">
                            <el-input-number v-model="dialogForm.formData.lateDeduct" :disabled="true" :controls="false"
                                :precision="3" />
                        </el-form-item>
                        <el-form-item label="旷工" label-width="60px">
                            <el-input-number v-model="dialogForm.formData.absenteeismDeduct" :disabled="true"
                                :controls="false" :precision="3" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="早退" label-width="80px">
                            <el-input-number v-model="dialogForm.formData.leaveEarlyDeduct" :disabled="true"
                                :controls="false" :precision="3" />
                        </el-form-item>
                        <el-form-item label="请假" label-width="80px">
                            <el-input-number v-model="dialogForm.formData.leaveDeduct" :disabled="true"
                                :controls="false" :precision="3" />
                        </el-form-item>
                    </el-col>

                </el-form-item>
                <el-form-item label="缴费">

                    <el-form-item label="社保" label-width="60px" style="display: inline-block;">
                        <el-input-number v-model="insurance.perSocialPay" :disabled="true" :controls="false"
                            :precision="3"></el-input-number>
                    </el-form-item>


                    <el-form-item label="公积金" label-width="80px" style="display: inline-block;">
                        <el-input-number v-model="insurance.perHousePay" :disabled="true" :controls="false"
                            :precision="3"></el-input-number>
                    </el-form-item>


                </el-form-item>
                <el-form-item label="最终工资">
                    <el-input-number v-model="dialogForm.formData.totalSalary" style="width:48%" :disabled="true"
                        :controls="false" :precision="3"></el-input-number>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"
                        v-model.trim="dialogForm.formData.remark" maxlength="100" show-word-limit style="width:48%" />
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="dialogForm.isShow = false" size="mini">取消</el-button>
                <el-button type="primary" @click="confirm" size="mini">确定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
import CommonForm from '../../../components/CommonForm'
import {
    getList,
    getImportApi,
    getExportApi,
    setSalary
} from '../../../api/salary'
import { getInsuranceByStaffId } from "../../../api/insurance"
export default {
    name: 'Salary',
    components: { CommonForm },
    data() {
        let checkSalary = (rule, value, callback) => {
            if (this.dialogForm.formData.totalSalary < 0) {
                callback(new Error("最终工资至少应该大于0"))
            } else {
                callback()
            }
        }
        return {
            searchForm: {
                formItemList: [
                    {
                        name: 'name',
                        label: '姓名',
                        type: 'input',
                        icon: 'el-icon-search'
                    }
                ],
                formData: {
                },
                inline: true,
            },
            month: '',
            table: {
                tableData: [],
                pageConfig: {
                    size: 10,
                    total: 10,
                    current: 1
                }
            },
            dialogForm: {
                formData: {},
                isShow: false,
                rules: {
                    baseSalary: [
                        { required: true, message: '请输入基础工资', trigger: 'blur' },
                        { validator: checkSalary, trigger: 'blur' }
                    ]
                }
            },
            insurance: {},
        };
    },
    watch: {
        'dialogForm.formData.baseSalary': function () {
            this.calculateSalary()
        },
        'dialogForm.formData.subsidy': function () {
            this.calculateSalary()
        },
        'dialogForm.formData.bonus': function () {
            this.calculateSalary()
        }
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
        // 计算工资
        calculateSalary() {
            this.dialogForm.formData.totalSalary = this.dialogForm.formData.baseSalary +
                this.dialogForm.formData.subsidy + this.dialogForm.formData.bonus -
                this.insurance.perHousePay - this.insurance.perSocialPay - this.dialogForm.formData.lateDeduct -
                this.dialogForm.formData.leaveEarlyDeduct -
                this.dialogForm.formData.leaveDeduct - this.dialogForm.formData.absenteeismDeduct
        },
        async loading() {
            let res = await getList(
                {
                    current: this.table.pageConfig.current,
                    size: this.table.pageConfig.size,
                    name: this.searchForm.formData.name,
                }
            );
            if (res.code == 200) {
                this.table.tableData = res.data.list;
                this.table.pageConfig.total = res.data.total;
                this.month = res.data.month
            }
        },
        // 导出数据
        exportData() {
            window.open(getExportApi(this.month))
        },
        handleSuccess(response) {
            if (response.code === 200) {
                this.$message.success("数据导入成功！")
                this.loading()
            } else {
                this.$message.error("数据导入失败！")
            }
        },
        handleSizeChange(size) {
            this.table.pageConfig.size = size
            this.loading()
        },
        handleCurrentChange(current) {
            this.table.pageConfig.current = current
            this.loading()
        },
        search() {
            this.loading();
        },
        reset() {
            this.searchForm.formData = {};
            this.loading();
        },
        //查看明细并修改
        async handleEdit(row) {
            let res = await getInsuranceByStaffId(row.staffId);
            if (res.code == 200) {
                this.insurance = res.data;
                this.dialogForm.formData = row;
                this.dialogForm.formData.month = this.month;
                this.calculateSalary();
                this.dialogForm.isShow = true;
            }
            else {
                this.$message.error("请先为此员工设置社保！");
            }

        },
        confirm() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    let res = await setSalary(this.dialogForm.formData);
                    if (res.code == 200) {
                        this.$message.success("保存成功")
                        this.dialogForm.isShow = false
                        this.loading()
                    } else {
                        this.$message.error("保存失败");
                    }
                }
                else {
                    return false;
                }
            })

        }
    },
    created() {
        this.loading();
    },
};
</script>
<style  scoped>

</style>