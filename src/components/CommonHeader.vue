<template>
    <div>
        <div class="header">
            <div class="l-content">
                <el-button icon="el-icon-menu" size="small" type="plain" @click="collapsed"></el-button>
            </div>


            <div class="r-content">

                <el-dropdown trigger="hover" size="mini" @command="handleCommand">
                    <span>
                        <img alt="" :src="downloadApi + infoForm.formData.avatar" class="avatar" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="showInfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="editPwd">修改密码</el-dropdown-item>
                        <el-dropdown-item command="leave">请假</el-dropdown-item>
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

            </div>
            <!-- 个人信息 -->
            <el-dialog title="个人信息" :visible.sync="infoForm.isShow">
                <CommonForm :formData="infoForm.formData" :formItemList="infoForm.formItemList"
                    :inline="infoForm.inline" />
                <div slot="footer">
                    <el-button @click="infoForm.isShow = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="submitInfo" size="small">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 修改密码 -->
            <el-dialog title="修改密码" :visible.sync="passwordForm.isShow">
                <CommonForm ref="passwordForm" :formData="passwordForm.formData"
                    :formItemList="passwordForm.formItemList" :inline="passwordForm.inline"
                    :rules="passwordForm.rules" />
                <div slot="footer">
                    <el-button @click="passwordForm.isShow = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="confirmPwd" size="small">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 请假 -->
            <el-dialog title="请假" :visible.sync="leaveForm.isShow">
                <el-tabs type="border-card">
                    <el-tab-pane label="请假">
                        <CommonForm ref="leaveForm" :formData="leaveForm.formData"
                            :formItemList="leaveForm.formItemList" :inline="leaveForm.inline" :rules="leaveForm.rules"
                            style="margin-left:20px" />
                        <div style="text-align:center">
                            <el-button @click="leaveForm.isShow = false" size="small" style="margin-right:15px">取
                                消</el-button>
                            <el-button type="primary" @click="confirmLeave" size="small" style="margin-left:15px">确
                                定</el-button>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="请假记录">
                        <CommonTable :tableData="table.tableData" :columnOptions="table.columnOptions"
                            :pageConfig="table.pageConfig" :height="300">
                            <template #tag="{ data }">
                                <el-tag size="small" :type="leaveForm.tagType[data.status]">
                                    {{ data.status }}</el-tag>
                            </template>
                            <template #btn="{ data }">
                                <el-button v-if="data.status == '未审核'" size="small" icon="el-icon-scissors"
                                    type="primary" title="撤销" @click="cancel(data)"></el-button>
                                <el-button v-else size="small" icon="el-icon-delete" type="danger" title="删除"
                                    @click="handleDel(data)"></el-button>
                            </template>
                        </CommonTable>
                    </el-tab-pane>
                </el-tabs>



            </el-dialog>
        </div>
    </div>

</template>

<script>
import { edit, checkPassword, updatePassword } from "../api/staff";
import { getUploadApi, getDownloadApi } from "../api/docs";
import { getLeaveBydeptId } from "@/api/leave";
import { getUnauditedByStaffId, add, getListByStaffId, deleteOne, edit as editLeave } from "@/api/staffLeave";
import CommonForm from './CommonForm.vue';
import CommonTable from './CommonTable.vue';
export default {
    name: 'CommonHeader',
    components: { CommonForm, CommonTable },
    data() {
        //检查密码是否正确
        let checkPwd = async (rule, value, callback) => {
            let res = await checkPassword(value, this.staff.id);
            if (res.code == 200) {
                callback();
            }
            else {
                callback(new Error("密码输入错误！"))
            }
        };
        let checkNewPwd = (rule, value, callback) => {
            if (value == this.passwordForm.formData.password) {
                callback(new Error('不能与原密码相同'));
            }
            else
                callback();
        };
        // 检查密码是否一致
        let checkConfirmPwd = (rule, value, callback) => {
            if (value !== this.passwordForm.formData.newPassword) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback();
            }
        };
        let checkDays = (rule, value, callback) => {
            let leaveItem = this.leaveList.find(item => item.typeId == this.leaveForm.formData.typeId)
            if (value > leaveItem.days) {
                callback(new Error('部门规定，' + leaveItem.name + '休假天数不超过' + leaveItem.days + '天!'))
            }
            else {
                callback();
            }

        };
        return {
            //个人信息
            infoForm: {
                formData: JSON.parse(localStorage.getItem("staff")) || {},
                formItemList: [
                    {
                        type: 'upload',
                        label: '头像',
                        action: getUploadApi(),
                        headers: this.headers
                    },
                    {
                        type: 'input',
                        name: 'name',
                        label: '姓名',

                    },
                    {
                        type: 'select',
                        name: 'gender',
                        label: '性别',
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
                        type: 'date',
                        name: 'birthday',
                        label: '生日'
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
                inline: false,
                isShow: false
            },
            //修改密码信息
            passwordForm: {
                formData: {},
                formItemList: [
                    {
                        type: 'password',
                        name: 'password',
                        label: '原密码'
                    },
                    {
                        type: 'password',
                        name: 'newPassword',
                        label: '新密码'
                    },
                    {
                        type: 'password',
                        name: 'confirmPassword',
                        label: '确认密码'
                    }
                ],
                rules: {
                    password: [
                        { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' },
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                        { validator: checkPwd, trigger: 'blur' }
                    ],
                    newPassword: [
                        { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' },
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { validator: checkNewPwd, trigger: 'blur' }
                    ],
                    confirmPassword: [
                        { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' },
                        { required: true, message: '请再次输入新密码', trigger: 'blur' },
                        { validator: checkConfirmPwd, trigger: 'blur' }
                    ]
                }
                ,
                inline: false,
                isShow: false
            },
            //请假信息
            leaveForm: {
                formData: {
                    days: 1
                },
                formItemList: [
                    {
                        type: 'select',
                        name: 'typeId',
                        placeholder: '请选择',
                        label: '假期类型',
                        optionList: [
                        ],
                    },
                    {
                        type: 'date',
                        name: 'startDate',
                        label: '起始日期',
                        pickerOptions: {
                            disabledDate(time) {
                                return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
                            }
                        }
                    },
                    {
                        type: 'number',
                        name: 'days',
                        label: '请假天数',
                        precision: 0,
                        min: 1
                    },
                    {
                        type: 'textarea',
                        name: 'remark',
                        label: '备注',
                        width: 50
                    }
                ],
                tagType: {
                    "未审核": "info",
                    "审核通过": "success",
                    "驳回": "danger",
                    "撤销": "warning"
                },
                isShow: false,
                inline: false,
                rules:
                {
                    typeId: [
                        { required: true, message: '请选择', trigger: 'change' },
                    ],
                    startDate: [
                        { required: true, message: '请选择开始日期', trigger: 'blur' }
                    ],
                    days: [
                        { required: true, message: '请输入请假天数', trigger: 'blur' },
                        { validator: checkDays, trigger: 'blur' }
                    ]
                }
            },
            table: {
                tableData: [],
                columnOptions: [
                    { name: 'typeName', width: 80, label: '类型' },
                    { name: 'startDate', width: 80, label: '起始日期' },
                    { name: 'days', width: 80, label: '天数' },
                    { label: '审核状态', width: 80, columnType: true, slotName: 'tag' },
                    { name: 'remark', width: 120, label: '备注' },
                    { label: '操作', width: 60, columnType: true, slotName: 'btn' }
                ],
                pageConfig: {
                    size: 10,
                    total: 100,
                    current: 1
                }
            }

        };
    },
    computed: {
        headers() {
            return localStorage.getItem("token");
        },
        downloadApi() {
            return getDownloadApi();
        },
        avatar() {
            return this.infoForm.formData.avatar;
        },
        staff() {
            return JSON.parse(localStorage.getItem("staff"));
        },
        leaveList() {
            return this.leaveForm.formItemList[0].optionList;
        }
    },
    methods: {
        //头像下拉菜单处理
        handleCommand(command) {
            switch (command) {
                case 'showInfo': {
                    this.infoForm.isShow = true;
                    break;
                }
                case 'editPwd': {
                    this.passwordForm.isShow = true;
                    break;
                }
                case 'leave': {
                    this.leaveForm.isShow = true;
                    this.getListByDeptId();
                    break;
                }
                case 'logout': {
                    this.$message.success("退出登录成功！")
                    this.$store.dispatch("loginOut");
                    break;
                }
            }
        },
        async submitInfo() {
            let res = await edit(this.infoForm.formData);
            if (res.code == 200) {
                localStorage.setItem("staff", JSON.stringify(this.infoForm.formData)) // 更新用户信息到浏览器
                this.$message.success("修改成功！")
                this.infoForm.isShow = false;
            }
            else {
                this.$message.error("修改失败");
            }
        },
        //通知组件折叠菜单栏
        collapsed() {
            this.$bus.$emit("collapsed");
        },
        confirmPwd() {
            this.$refs.passwordForm.$refs.form.validate(async valid => {
                if (valid) {
                    let res = await updatePassword({ id: this.staff.id, password: this.passwordForm.formData.newPassword });
                    if (res.code == 200) {
                        this.$message.success("修改密码成功,请重新登录");
                        this.passwordForm.isShow = false;
                        this.$store.dispatch("loginOut");
                    }
                    else {
                        this.$message.error("修改密码失败!");
                    }
                }
                else {
                    return false;
                }
            })

        },
        //获取请假列表
        async getListByDeptId() {
            let res = await getLeaveBydeptId(this.staff.deptId)
            if (res.code === 200) {
                this.leaveForm.formItemList[0].optionList = res.data
            }
        },
        //请假表单提交
        async confirmLeave() {
            let res = await getUnauditedByStaffId(this.staff.id);
            if (res.code == 200) {
                this.$message.error("你有未审批的休假申请，目前不能请假！");
            }
            else {
                this.$refs.leaveForm.$refs.form.validate(async valid => {
                    if (valid) {
                        this.leaveForm.formData.staffId = this.staff.id
                        res = await add(this.leaveForm.formData);
                        if (res.code == 200) {
                            this.$message.success("提交成功");
                            this.$refs.leaveForm.$refs.form.resetFields();
                            this.leaveForm.formData = {
                                days: 1
                            }
                        }
                        else
                            this.$message.error("提交失败");
                    }
                    else
                        return false;
                })
            }
        },
        //获取请假记录列表
        async loading() {
            let res = await getListByStaffId({
                current: this.table.pageConfig.current,
                size: this.table.pageConfig.size,
                id: this.staff.id
            });
            if (res.code == 200) {
                this.table.tableData = res.data.list;
                this.table.pageConfig.total = res.data.total;
            }
        },
        //撤销请假申请
        async cancel(data) {
            let res = await editLeave({ id: data.id, status: '撤销' });
            if (res.code == 200) {
                this.loading();
                this.$message.success("撤销成功");
            }
            else {
                this.$message.error("撤销失败");
            }
        },
        //删除请假记录
        async handleDel(data) {
            let res = await deleteOne(data.id);
            if (res.code == 200) {
                this.table.pageConfig.current = this.table.tableData.length == 1 ? this.table.pageConfig.current - 1 : this.table.pageConfig.current
                this.loading();
                this.$message.success("删除成功");
            }
            else {
                this.$message.error("删除失败");
            }
        }
    },
    mounted() {
        this.loading();
        this.$bus.$on('uploadSuccess', docs => {
            this.infoForm.formData.avatar = docs.name
        });
        this.$bus.$on('changeSize', size => {
            this.table.pageConfig.size = size;
            this.loading();
        });
        this.$bus.$on('changeCurrent', page => {
            this.table.pageConfig.current = page;
            this.loading();
        });
    },
    beforeDestroy() {
        this.$bus.$off('uploadSuccess');
        this.$bus.$off('changeSize');
        this.$bus.$off('changeCurrent');
    }
};
</script>
<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // width: 100%;
    height: 60px;


    .l-content {
        margin-left: 20px;
    }

    .r-content {


        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 20px;
            background-color: #fff;
        }


    }

}
</style>