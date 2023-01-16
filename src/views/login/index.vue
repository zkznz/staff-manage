<template>
  <div>
    <div class="wrapper">
      <div class="card">
        <div class="header">
          <img src="../../assets/logo.png" alt="">
          <h2>人力资源管理系统</h2>
        </div>
        <el-form :model="userInfo" :rules="rules" ref="userForm">
          <el-form-item prop="code">
            <el-input placeholder="请输入账号" prefix-icon="el-icon-user" v-model="userInfo.code"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码" v-model="userInfo.password"
              prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" style="width:100%" @click="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

  </div>

</template>

<script >
import { login } from '@/api/login';
export default {
  name: 'Login',
  data() {
    return {
      userInfo: {},
      rules: {
        code: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleLogin() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          let res = await login(this.userInfo);
          if (res.code == 200) {
            localStorage.setItem("staff", JSON.stringify(res.data));
            localStorage.setItem("token", res.token);
            this.$message.success("登录成功！")
            this.$router.push({
              path: '/'
            })
          }
          else {
            this.$message.error(res.message)
          }
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
  background-image: url('../../assets/images/bgimg.png');
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  width: 350px;
  height: 300px;
  background-color: #fff;
  margin: 150px auto;


  .header {
    position: relative;
    margin-bottom: 30px;
    font-weight: 600;
    text-align: center;

    img {
      position: absolute;
      left: 85px;
      width: 20px;
      height: 20px;
    }
  }

  .el-form {
    padding: 0 20px;
  }

}
</style>