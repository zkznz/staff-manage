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
                :height="400" :hasSelect="table.hasSelect" :operateWidth="300" :pageConfig="table.pageConfig">
                <template #slot1="{ data }">
                    <el-button style="margin-left: 10px;" type="warning" size="mini" icon="el-icon-circle-plus-outline"
                        v-if="data.parentId === 0" @click="handleSubAdd(data)">新增部门
                    </el-button>
                    <el-button style="margin-left: 10px;" type="info" v-else @click="handleSetting(data)"
                        icon="el-icon-setting" size="mini">考勤设置
                    </el-button>
                </template>
            </CommonTable>
        </el-card>
        <!-- 部门表单 -->
        <el-dialog :title="dialogForm.type == 'add' ? '新增部门' : '更新部门'" :visible.sync="dialogForm.isShow">
            <CommonForm :formItemList="dialogForm.formItemList" :formData="dialogForm.formData"
                :inline="dialogForm.inline"></CommonForm>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogForm.isShow = false" size="mini">取消</el-button>
                <el-button type="primary" @click="confirm" size="mini">确定</el-button>
            </div>
        </el-dialog>
        <!-- 考勤设置表单 -->
        <el-dialog :title="settingDialog.type" :visible.sync="settingDialog.isShow">
            <el-tabs type="border-card" @tab-click="clickTab">
                <el-tab-pane label="出勤设置">
                    <el-form :model="settingDialog.workTimeForm.formData" ref="workTimeForm"
                        :rules="settingDialog.workTimeForm.rules" style="margin-top: 5px;" size="mini"
                        label-width="100px">
                        <el-form-item label="出勤时间">
                            <el-form-item label="早上" label-width="40px">
                                <el-form-item prop="morStartTime" style="display:inline-block">
                                    <el-time-select v-model="settingDialog.workTimeForm.formData.morStartTime"
                                        placeholder="开始" :picker-options="morningStartOption">
                                    </el-time-select>
                                </el-form-item>
                                <span> - </span>
                                <el-form-item prop="morEndTime" style="display:inline-block">
                                    <el-time-select placeholder="结束"
                                        v-model="settingDialog.workTimeForm.formData.morEndTime"
                                        :picker-options="morningEndOption">
                                    </el-time-select>
                                </el-form-item>
                            </el-form-item>
                            <el-form-item label="下午" label-width="40px">
                                <el-form-item style="display:inline-block" prop="aftStartTime">
                                    <el-time-select placeholder="开始"
                                        v-model="settingDialog.workTimeForm.formData.aftStartTime"
                                        :picker-options="afternoonStartOption">
                                    </el-time-select>
                                </el-form-item>

                                <span> - </span>
                                <el-form-item style="display:inline-block" prop="aftEndTime">
                                    <el-time-select placeholder="结束"
                                        v-model="settingDialog.workTimeForm.formData.aftEndTime"
                                        :picker-options="afternoonEndOption">
                                    </el-time-select>
                                </el-form-item>

                            </el-form-item>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="请假设置">
                    <el-form :model="settingDialog.leaveForm.formData" label-width="100px" size="mini" ref="leaveForm"
                        :rules="settingDialog.leaveForm.rules">
                        <el-form-item label="假期类型" prop="typeId">
                            <el-select style="width:38%" v-model="settingDialog.leaveForm.formData.typeId"
                                @change="handleChange">
                                <el-option v-for="option in settingDialog.leaveForm.leaveTypeList" :key="option.id"
                                    :value="option.id" :label="option.name" :disabled="option.status == 0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-switch v-model="settingDialog.leaveForm.formData.status" active-color="#13ce66"
                                inactive-color="#ff4949" active-text="启用" inactive-text="禁用" :active-value="1"
                                :inactive-value="0" :disabled="settingDialog.leaveForm.disabled" />
                        </el-form-item>
                        <el-form-item label="休假天数" prop="days">
                            <el-input-number style="width:38%" v-model="settingDialog.leaveForm.formData.days"
                                :disabled="settingDialog.leaveForm.formData.status == 0" :min="1"
                                step-strictly></el-input-number>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model.trim="settingDialog.leaveForm.formData.remark"
                                :disabled="settingDialog.leaveForm.formData.status == 0" style="width:50%"
                                :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" maxlength="100"
                                show-word-limit></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>


            </el-tabs>
            <div slot="footer">
                <el-button @click="settingDialog.isShow = false" size="mini">取消</el-button>
                <el-button type="primary" @click="saveSetting" size="mini">保存</el-button>
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
            dialogForm: {
                type: '', // add为新增，edit为编辑
                isShow: false,
                formItemList: [
                    {
                        name: 'name',
                        label: '名称',
                        type: 'input'
                    },
                    {
                        name: 'remark',
                        label: '备注',
                        type: 'textarea'
                    }
                ],
                formData: {},
                inline: false
            },
            //考勤设置表单
            settingDialog: {
                isShow: false,
                type: '出勤设置',
                workTimeForm: {
                    morning: {
                        startOption: {
                            start: '06:00',
                            step: '00:10',
                            end: '09:30'
                        },
                        endOption: {
                            start: '10:00',
                            step: '00:10',
                            end: '12:30'
                        }
                    },
                    afternoon: {
                        startOption: {
                            start: '13:00',
                            step: '00:10',
                            end: '15:00'
                        },
                        endOption: {
                            start: '16:30',
                            step: '00:10',
                            end: '23:59'
                        }
                    },
                    rules: {
                        morStartTime: [
                            { required: true, message: '请选择开始时间', trigger: 'blur' }
                        ],
                        morEndTime: [{
                            required: true, message: '请选择结束时间', trigger: 'blur'
                        }],
                        aftStartTime: [{
                            required: true, message: '请选择开始时间', trigger: 'blur'
                        }],
                        aftEndTime: [{
                            required: true, message: '请选择开始时间', trigger: 'blur'
                        }]
                    },
                    formData: {},
                },
                leaveForm: {
                    formData: {},
                    rules: {
                        typeId: [{
                            required: true, message: '请选择请假类型', trigger: 'change'
                        }],
                        days: [{
                            required: true, message: '请选择休假天数', trigger: 'blur'
                        }]
                    },
                    leaveTypeList: [],
                    disabled: true
                }
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
            },
            ids: [],
            //部门id
            depId: 0
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
        //早上出勤时间设置
        morningStartOption() {
            return this.settingDialog.workTimeForm.morning.startOption;
        },
        morningEndOption() {
            return this.settingDialog.workTimeForm.morning.endOption;
        },
        afternoonStartOption() {
            return this.settingDialog.workTimeForm.afternoon.startOption;
        },
        afternoonEndOption() {
            return this.settingDialog.workTimeForm.afternoon.endOption;
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
        handleEdit(row) {
            this.dialogForm.type = 'edit'
            this.dialogForm.formData = { id: row.id, name: row.name, remark: row.remark }
            this.dialogForm.isShow = true
        },
        async handleDelete(id) {
            let res = await deleteOne(id);
            if (res.code == 200) {
                this.$message.success("删除成功！")
                this.loading()
            }
            else {
                this.$message.error("删除失败！")
            }
        },
        async handleDeleteBatch() {
            let res = await deleteBatch();
            if (res.code == 200) {
                this.$message.success("批量删除成功！")
                this.loading()
            }
            else {
                this.$message.error("批量删除失败！")
            }
        },
        async confirm() {
            // 通过type来判断是新增还是编辑
            if (this.dialogForm.type === 'add') {
                let response = await add(this.dialogForm.formData)
                if (response.code === 200) {
                    this.$message.success("添加成功！")
                    this.dialogForm.isShow = false
                    this.loading()
                } else {
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
        addData() {
            this.dialogForm.type = 'add';
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
        //新增部门
        handleSubAdd(data) {
            this.dialogForm.type = 'add';
            this.dialogForm.formData = { parentId: data.id };
            this.dialogForm.isShow = true;
        },
        //考勤设置
        async handleSetting(data) {
            this.depId = data.id;
            this.settingDialog.isShow = true;
            if (this.settingDialog.type == '出勤设置') {
                this.settingDialog.workTimeForm.formData = {};
                if (data.workTimeId != null) {
                    let res = await getOne(data.workTimeId);
                    this.settingDialog.workTimeForm.formData = res.data;
                }
            }
            else {
                this.settingDialog.leaveForm.disabled = true;
                this.settingDialog.leaveForm.formData = {};
                this.$nextTick(() => {
                    this.$refs.leaveForm.clearValidate();
                })
                this.getAllLeaveType();
            }
        },
        //保存考勤和请假设置
        saveSetting() {
            if (this.settingDialog.type == '出勤设置') {
                this.settingDialog.workTimeForm.depId = this.depId;
                this.$refs.workTimeForm.validate(async valid => {
                    if (valid) {
                        let response = await setWorkTime(this.settingDialog.workTimeForm.formData)
                        if (response.code === 200) {
                            this.$message.success("保存成功")
                            this.loading()
                            this.settingDialog.isShow = false;
                        } else {
                            this.$message.error("保存失败")
                        }

                    } else {
                        return false
                    }
                })
            }
            else {
                this.settingDialog.leaveForm.formData.deptId = this.deptId
                this.$refs.leaveForm.validate(async valid => {
                    if (valid) {
                        let response = await setLeave(this.settingDialog.leaveForm.formData)
                        if (response.code === 200) {
                            this.$message.success("保存成功");
                            this.settingDialog.isShow = false;
                        } else {
                            this.$message.error("保存失败")
                        }
                    } else {
                        return false
                    }
                })
            }
        },
        //获取请假类型
        async getAllLeaveType() {
            let response = await getAll()
            if (response.code === 200) {
                this.settingDialog.leaveForm.leaveTypeList = response.data
            } else {
                this.$message.error("获取数据失败！")
            }
        },
        //点击标签页
        clickTab(tab) {
            this.settingDialog.type = tab.label;
            if (tab.label === '请假设置') {
                this.getAllLeaveType();
            }
        },
        //请假类型下拉框变化回调函数
        async handleChange(id) {
            this.settingDialog.leaveForm.disabled = false;
            let res = await getLeave(this.depId, id);
            if (res.code == 200) {
                console.log(res.data);
                this.settingDialog.leaveForm.formData = res.data;
            }
            else {
                this.settingDialog.leaveForm.formData = { typeId: id, status: 0 }
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
        this.$bus.$off("selectionChange")
    }
};
</script>
<style  scoped>

</style>