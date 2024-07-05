<template>
    <div>
        <el-container class="home_container">
            <el-header>
                <el-row>
                    <el-col :span="4">
                        <p class="systerm_name">LYF学习后台管理系统</p>
                    </el-col>
                    <el-col :offset="12" :span="8" style="min-width: 150px;">
                        <el-dropdown style="float: right;margin: 20px 10px;">
                            <span class="systerm_right" style="color: white;cursor: pointer;">
                                系统管理&nbsp;
                                <el-icon class="systerm_right_icon">
                                    <ArrowDown />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="userDetail">个人信息</el-dropdown-item>
                                    <el-dropdown-item @click="outSysterm">退出系统</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <el-avatar :src="avatarImg" shape="square" fit="fill" style="margin: 10px; float: right;" />
                    </el-col>
                </el-row>
            </el-header>
            <el-container style="overflow: auto;">
                <!--菜单-->
                <el-aside>
                    <div class="toggle_button" @click="isCollapse = !isCollapse">
                        <el-icon :size="20">
                            <Expand v-if="isCollapse" />
                            <Fold v-else />
                        </el-icon>
                    </div>
                    <el-menu router :default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse">
                        <el-menu-item index="/index" @click="saveActiveNav('/index')">
                            <el-icon>
                                <House />
                            </el-icon>
                            <span>首页</span>
                        </el-menu-item>
                        <el-menu-item index="/layout" @click="saveActiveNav('/layout')">
                            <el-icon>
                                <CoffeeCup />
                            </el-icon>
                            <span>自定义组件</span>
                        </el-menu-item>
                        <el-sub-menu index="1">
                            <template #title>
                                <el-icon>
                                    <Setting />
                                </el-icon>
                                <span>系统设置</span>
                            </template>
                            <el-menu-item index="/user/list" @click="saveActiveNav('/user/list')">
                                <el-icon>
                                    <User />
                                </el-icon>
                                <span>用户管理</span>
                            </el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <router-view />
                    </el-main>
                    <el-footer>Copyright @2023 LYF学习</el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import { ArrowDown, House, Setting, User, Expand, Fold, CoffeeCup } from '@element-plus/icons-vue';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import avatarImg from "../../assets/img/avatar.jpg";

const router = useRouter();
let isCollapse = ref<boolean>(false);
let activePath = ref("");

// 记录当前路由，刷新时候使用
onBeforeMount(()=>{
    activePath.value = sessionStorage.getItem('activePath') ?? "/index";
});

const userDetail = ()=>{};
const outSysterm = ()=>{
    sessionStorage.clear();
    router.push('/login');
};

const saveActiveNav = (path: string)=>{
    sessionStorage.setItem('activePath', path);
    activePath.value = path;
};

</script>
<style scoped>
.home_container {
    position: absolute;
    height: 100%;
    top: 0px;
    left: 0px;
    width: 100%;
    background: #f2f3f5;
}
.el-header {
    background: #2661ef;
    padding: 0 10px;
    overflow: hidden;
}

.systerm_name {
    color: #fff;
    font-size: 18px;
}

.el-aside {
    background: white;
    width: auto !important;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-footer {
    color: #cccccc;
    text-align: center;
    line-height: 60px;
}

.el-footer:hover {
    color: #2661ef;
}

.toggle_button {
    background-color: #d9e0e7;
    font-size: 18px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
    color: black;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-menu-item.is-active {
    color: #fff !important;
    font-size: 15px;
    font-weight: bold;
    background-color: #2661ef !important;
    border-radius: 2px;
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    margin: 2px 5px 0px 2px;
}

</style>