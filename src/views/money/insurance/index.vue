<template>
    <div>
        <!-- 操作 -->
        <div>
            <el-upload :action="importApi" :headers="header" accept="xlsx" :multiple="false" :on-success="handleSuccess"
                :show-file-list="false" style="display: inline-block;">
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
            <el-table :data="table.tableData" height="400px" border stripe row-key="id" :header-cell-style="{
                background: '#eef1f6', color: '#606266',
                textAlign: 'center', fontWeight: 'bold', border: '1px solid #ccc',
                padding: '0'
            }">
                <el-table-column prop="code" label="工号" min-width="125" />
                <el-table-column prop="name" label="姓名" min-width="125" />
                <el-table-column prop="deptName" label="部门" min-width="125" />
                <el-table-column prop="phone" label="电话" min-width="125" />
                <el-table-column label="社保">
                    <el-table-column prop="socialBase" label="缴纳基数" min-width="125" />
                    <el-table-column label="个人">
                        <el-table-column prop="perSocialPay" label="缴纳费用" min-width="125" />
                    </el-table-column>
                    <el-table-column label="企业">
                        <el-table-column prop="comInjuryRate" label="工伤保险缴纳比例" min-width="125" />
                        <el-table-column prop="comSocialPay" label="缴纳费用" min-width="125" />
                    </el-table-column>
                    <el-table-column prop="socialRemark" label="备注" min-width="200" />
                </el-table-column>
                <el-table-column label="公积金">
                    <el-table-column prop="houseBase" label="缴纳基数" min-width="125" />
                    <el-table-column label="个人">
                        <el-table-column prop="perHouseRate" label="缴纳比例" min-width="125" />
                        <el-table-column prop="perHousePay" label="缴纳费用" min-width="125" />
                    </el-table-column>
                    <el-table-column label="企业">
                        <el-table-column prop="comHouseRate" label="缴纳比例" min-width="125" />
                        <el-table-column prop="comHousePay" label="缴纳费用" min-width="125" />
                    </el-table-column>
                    <el-table-column prop="houseRemark" label="备注" min-width="200" />
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleEdit(scope.row)">明细 <i
                                class="el-icon-edit"></i></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="margin-top: 10px;" class="pager" layout="->,total,sizes,prev,pager,next,jumper"
                :page-size="table.pageConfig.size ? table.pageConfig.size : 10" :page-sizes="[5, 10, 15, 20]"
                :total="table.pageConfig.total" :current-page.sync="table.pageConfig.current"
                @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </el-card>
        <!-- 对话框 -->
        <el-dialog title="五险一金" :visible.sync="dialogForm.isShow">
            <el-form ref="dialogForm" size="small" :model="dialogForm.formData" :rules="dialogForm.rules">
                <el-form-item label="参保城市" prop="cityId">
                    <el-select v-model="dialogForm.formData.cityId" placeholder="请选择参保城市" @change="selectChange">
                        <el-option v-for="item in dialogForm.cityList" :key="item.id" :value="item.id"
                            :label="item.name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="社保基数" prop="socialBase">
                    <el-input-number v-model="dialogForm.formData.socialBase" :precision="3" />
                    （基数范围：{{ insuranceTable.tableData[0].socLowerLimit }}￥ ~ {{
                        insuranceTable.tableData[0].socUpperLimit
                    }}￥）
                </el-form-item>
                <el-form-item label="工伤比例" prop="comInjuryRate">
                    <el-input-number v-model="dialogForm.formData.comInjuryRate" :step="0.001" :precision="3" />
                    （比例范围：0.002 ~ 0.019，推荐0.019）
                </el-form-item>
                <el-form-item label="社保缴纳">
                    <el-form-item label="个人" prop="perSocialPay" style="display:inline-block" label-width="50px">
                        <el-input-number v-model="dialogForm.formData.perSocialPay" :disabled="true" :controls="false"
                            :precision="3"></el-input-number>
                    </el-form-item>
                    <el-form-item label="公司" prop="comSocialPay" label-width="50px" style="display:inline-block">
                        <el-input-number v-model="dialogForm.formData.comSocialPay" :disabled="true" :controls="false"
                            :precision="3"></el-input-number>
                    </el-form-item>
                    <el-table :data="insuranceTable.tableData" border stripe>
                        <el-table-column label="养老保险缴费比例">
                            <el-table-column label="个人" prop="perPensionRate" />
                            <el-table-column label="企业" prop="comPensionRate" />
                        </el-table-column>
                        <el-table-column label="医疗保险缴费比例">
                            <el-table-column label="个人" prop="perMedicalRate" />
                            <el-table-column label="企业" prop="comMedicalRate" />
                        </el-table-column>
                        <el-table-column label="失业保险缴费比例">
                            <el-table-column label="个人" prop="perUnemploymentRate" />
                            <el-table-column label="企业" prop="comUnemploymentRate" />
                        </el-table-column>
                        <el-table-column label="生育保险企业缴费比例" prop="comMaternityRate" />
                    </el-table>

                </el-form-item>
                <el-form-item label="社保备注" prop="socialRemark">
                    <el-input v-model.trim="dialogForm.formData.socialRemark" type="textarea" :rows="2"
                        placeholder="1-300字符" maxlength="300" style="width:38%" show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="公积金基数" prop="houseBase">
                    <el-input-number v-model="dialogForm.formData.houseBase" style="width:38%" :precision="3" />
                    （基数范围：{{ insuranceTable.tableData[0].houLowerLimit }}￥ ~ {{
                        insuranceTable.tableData[0].houUpperLimit
                    }}￥）
                </el-form-item>
                <el-form-item label="企业比例" prop="comHouseRate">
                    <el-input-number v-model="dialogForm.formData.comHouseRate" style="width:38%" :precision="3"
                        :step="0.001" />
                    （比例范围：0.05 ~ 0.12，推荐0.12）
                </el-form-item>
                <el-form-item label="个人比例" prop="perHouseRate">
                    <el-input-number v-model="dialogForm.formData.perHouseRate" style="width:38%" :precision="3"
                        :step="0.001" />
                    （比例范围：0.05 ~ 0.12，推荐0.12）
                </el-form-item>
                <el-form-item label="公积金缴纳">
                    <el-form-item label="个人" label-width="50px" style="display:inline-block" prop="perHousePay">
                        <el-input-number v-model="dialogForm.formData.perHousePay" :disabled="true" :controls="false"
                            :precision="3" />
                    </el-form-item>
                    <el-form-item label="公司" label-width="50px" style="display:inline-block" prop="comHousePay">
                        <el-input-number v-model="dialogForm.formData.comHousePay" :disabled="true" :controls="false"
                            :precision="3" />
                    </el-form-item>
                </el-form-item>
                <el-form-item label="公积金备注" prop="houseRemark">
                    <el-input v-model.trim="dialogForm.formData.houseRemark" type="textarea" :rows="2"
                        placeholder="1-300字符" style="width:38%" maxlength="300" show-word-limit />
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogForm.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="edit" size="mini">确 定</el-button>
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
    getOne as getInsurance,
    setInsurance
} from '../../../api/insurance'
import {
    getAll, getOne
} from '../../../api/city'
export default {
    name: 'Insurance',
    components: { CommonForm },
    data() {
        let checkSocialBase = (rule, value, callback) => {
            if (value < this.insuranceTable.tableData[0].socLowerLimit || value > this.insuranceTable.tableData[0].socUpperLimit) {
                callback(new Error("社保基数应该在" + this.insuranceTable.tableData[0].socLowerLimit + " ~ " + this.insuranceTable.tableData[0].socUpperLimit + "之间"))
            } else {
                callback()
            }
        }
        let checkComInjuryRate = (rule, value, callback) => {
            if (value < 0.002 || value > 0.019) {
                callback(new Error("工伤保险企业缴费比例应在0.002 ~ 0.019之间"))
            } else {
                callback()
            }
        }
        let checkHouseBase = (rule, value, callback) => {
            if (value < this.insuranceTable.tableData[0].houLowerLimit || value > this.insuranceTable.tableData[0].houUpperLimit) {
                callback(new Error("公积金基数应该在" + this.insuranceTable.tableData[0].houLowerLimit + " ~ " + this.insuranceTable.tableData[0].houUpperLimit + "之间"))
            } else {
                callback()
            }
        }
        let checkHouseRate = (rule, value, callback) => {
            if (value < 0.05 || value > 0.12) {
                callback(new Error("公积金缴费比例应在0.05 ~ 0.12之间"))
            } else {
                callback()
            }
        }
        return {
            //搜索框
            searchForm: {
                formItemList: [
                    {
                        name: 'name',
                        label: '姓名',
                        type: 'input',
                        icon: 'el-icon-search'
                    }
                ],
                formData: {},
                inline: true
            },
            table: {
                tableData: [],
                pageConfig: {
                    total: 10, // 记录总数
                    current: 1, // 起始页
                    size: 10 // 每页展示的记录数
                }
            },
            //对话框
            dialogForm: {
                formData: {},
                cityList: [],
                isShow: false,
                rules: {
                    cityId: [
                        { required: true, message: "请选择参保地", trigger: 'change' }
                    ],
                    socialBase: [
                        { required: true, message: "请输入社保基数", trigger: 'blur' },
                        { validator: checkSocialBase, trigger: 'blur' }
                    ],
                    comInjuryRate: [
                        { required: true, message: "请输入工伤保险企业缴费比例", trigger: 'blur' },
                        { validator: checkComInjuryRate, trigger: 'blur' }
                    ],
                    houseBase: [
                        { required: true, message: "请输入公积金基数", trigger: 'blur' },
                        { validator: checkHouseBase, trigger: 'blur' }
                    ],
                    comHouseRate: [
                        { required: true, message: "请输入公积金企业缴费比例", trigger: 'blur' },
                        { validator: checkHouseRate, trigger: 'blur' }
                    ],
                    perHouseRate: [
                        { required: true, message: "请输入公积金个人缴费比例", trigger: 'blur' },
                        { validator: checkHouseRate, trigger: 'blur' }
                    ]
                }
            },
            insuranceTable: {
                tableData: [{
                    socLowerLimit: 0,
                    socUpperLimit: 0,
                    houLowerLimit: 0,
                    houUpperLimit: 0
                }],
            }
        };
    },
    computed: {
        header() {
            return {
                token: localStorage.getItem("token")
            }
        },
        importApi() {
            return getImportApi()
        }
    },
    mounted() {
        this.loading();
    },
    watch: {
        'dialogForm.formData.socialBase': function () {
            this.calculatePerSocialPay()
            this.calculateComSocialPay()
        },
        'dialogForm.formData.comInjuryRate': function () {
            this.calculateComSocialPay()
        },
        'dialogForm.formData.houseBase': function () {
            this.calculatePerHousePay()
            this.calculateComHousePay()
        },
        'dialogForm.formData.comHouseRate': function () {
            this.calculateComHousePay()
        },
        'dialogForm.formData.perHouseRate': function () {
            this.calculatePerHousePay()
        }
    },
    methods: {
        async loading() {
            let res = await getList({
                current: this.table.pageConfig.current,
                size: this.table.pageConfig.size,
                name: this.searchForm.formData.name
            })
            if (res.code === 200) {
                this.table.tableData = res.data.list
                this.table.pageConfig.total = res.data.total
            }
        },
        handleSizeChange(size) {
            this.table.pageConfig.size = size;
            this.loading();
        },
        handleCurrentChange(current) {
            this.table.pageConfig.current = current;
            this.loading();
        },
        handleSuccess(response) {
            if (response.code === 200) {
                this.$message.success("数据导入成功！")
                this.loading()
            } else {
                this.$message.error("数据导入失败！")
            }
        },
        //导出数据
        exportData() {
            window.open(getExportApi());
        },
        search() {
            this.loading();
        },
        reset() {
            this.searchForm.formData.name = "";
            this.loading();
        },
        async handleEdit(row) {
            this.dialogForm.formData = {}
            this.dialogForm.isShow = true
            this.dialogForm.formData.staffId = row.staffId
            this.getCity()
            if (row.cityId !== null) {
                let response = await getOne(row.cityId)
                if (response.code === 200) {
                    this.insuranceTable.tableData = [response.data]
                }
                response = await getInsurance(row.insuranceId)
                if (response.code === 200) {
                    this.dialogForm.formData = response.data
                }

            }
        },
        // 获取社保城市
        async getCity() {
            let response = await getAll()
            if (response.code === 200) {
                this.dialogForm.cityList = response.data
            } else {
                this.$message.error("数据获取失败")
            }
        },
        edit() {
            this.$refs.dialogForm.validate(async valid => {
                if (valid) {
                    let response = await setInsurance(this.dialogForm.formData)
                    if (response.code === 200) {
                        this.$message.success("设置成功！")
                        this.dialogForm.isShow = false
                        this.loading()
                    } else {
                        this.$message.error("设置失败！")
                    }
                } else {
                    return false
                }
            })
        },
        selectChange(id) {
            this.insuranceTable.tableData = this.dialogForm.cityList.filter(item => item.id == id)
        },
        calculatePerSocialPay() {
            this.dialogForm.formData.perSocialPay = (this.insuranceTable.tableData[0].perPensionRate +
                this.insuranceTable.tableData[0].perMedicalRate +
                this.insuranceTable.tableData[0].perUnemploymentRate) * this.dialogForm.formData.socialBase
        },
        calculateComSocialPay() {
            this.dialogForm.formData.comSocialPay = (this.insuranceTable.tableData[0].comPensionRate +
                this.insuranceTable.tableData[0].comMedicalRate +
                this.insuranceTable.tableData[0].comUnemploymentRate + this.insuranceTable.tableData[0].comMaternityRate +
                this.dialogForm.formData.comInjuryRate) * this.dialogForm.formData.socialBase
        },
        calculatePerHousePay() {
            this.dialogForm.formData.perHousePay = this.dialogForm.formData.perHouseRate * this.dialogForm.formData.houseBase
        },
        calculateComHousePay() {
            this.dialogForm.formData.comHousePay = this.dialogForm.formData.comHouseRate * this.dialogForm.formData.houseBase
        },
    },

};
</script>
<style  scoped>

</style>