<template>
    <div class="login_container">
        <el-container class="login_main">
            <el-header>
                <div style="width: 400px;">
                    <p style="float: left;">
                        <el-icon color="#409EFF" :size="50">
                            <ElementPlus />
                        </el-icon>
                    </p>
                    <p style="float: left;font-size: 25px;font-weight: bold;">
                        欢迎来到lyf后台学习系统
                    </p>
                </div>
            </el-header>
            <el-main>
                <el-card class="login_card">
                    <el-form :model="formData" ref="loginForm" :rulers="rulers" label-width="80px">
                        <el-form-item label="账号" prop="userName">
                            <el-input class="login_input" v-model="formData.userName" placeholder="请输入账号" />
                        </el-form-item>
                        <el-form-item label="密码" prop="passWord">
                            <el-input class="login_input" v-model="formData.passWord" type="password" placeholder="请输入密码" />
                        </el-form-item>
                        <el-form-item style="text-align: right;">
                            <el-button type="primary" @click="resetForm">重置</el-button>
                            <el-button type="primary" @click="submitLogin">登录</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import { ElementPlus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import router from '../../router/index';
import { LoginApi } from "../../api/LoginApi";
import { dynamicRouters } from "../../router/index";

// form数据
const formData = reactive({
    userName: "",
    passWord: ""
});
// form校验规则
const rulers = reactive({
    userName: [{ required: true, message: "账号不能为空", trigger: 'blur' }],
    passWord: [{ required: true, message: "密码不能为空", trigger: 'blur' }]
});
//
const loginForm = ref();
//
const submitLogin = () => {
    if(!loginForm){ return; }
    loginForm.value.validate(async ()=>{
        // 后端api验证账密是否正确
        const check = await LoginApi.query(formData.userName, formData.passWord);
        //
        if(check){
            router.addRoute(dynamicRouters[0]);
            sessionStorage.setItem('token', 'adwawdaiohdnawdha2131');
            router.push('/home');
        }else{
            ElMessage.error("密码错误，请重新输入");
        }
    });
};
const resetForm = () => loginForm?.value.resetFields();

</script>
<style scoped>
.login_container{
    width: 100%;
    height: 100%;
    position: relative;
    background: linear-gradient(135deg, #578fe9, #88cbea);
}
.login_main{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    background-color: #ffffff;
    border-radius: 5px;
}
.login_input{
    width: 250px;
}
</style>