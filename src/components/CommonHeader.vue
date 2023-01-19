<template>
    <div>
        <div class="header">
            <div class="l-content">
                <el-button icon="el-icon-menu" size="small" type="plain" @click="collapsed"></el-button>
            </div>


            <div class="r-content">

                <el-dropdown trigger="hover" size="mini" @command="handleCommand">
                    <span>
                        <img alt="" src="../assets/images/avatar.png" class="avatar" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="showInfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="editPwd">修改密码</el-dropdown-item>
                        <el-dropdown-item command="leave">请假</el-dropdown-item>
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: '',
    data() {
        return {
        };
    },
    methods: {
        //头像下拉菜单处理
        handleCommand(command) {
            switch (command) {
                case 'showInfo': {

                    break;
                }
                case 'editPwd': {

                    break;
                }
                case 'leave': {

                    break;
                }
                case 'logout': {
                    this.$message.success("退出登录成功！")
                    this.$store.dispatch("loginOut");
                    break;
                }
            }
        },
        //通知组件折叠菜单栏
        collapsed() {
            this.$bus.$emit("collapsed");
        }
    },
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