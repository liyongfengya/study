import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

/**
 * 设计思：针对不同的用户，会开放不同的界面，因此需要后端动态控制路由
 */


/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink:true 2、链接地址不为空`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，，开启条件，`1、isIframe:true 2、链接地址不为空`
 *      projectIds：    当前路由权限标识，取项目ID,优先级最高
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 通用：meta 维尚：ws
 *      excludeRoles:   排除当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 通用：meta 维尚：ws
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */


const loginRouters: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: 'login'
    },
    {
        path: '/login',
        name: 'login',
        meta: { title: '登录' },
        component: ()=> import('../views/login/Login.vue')
    },
];
export const dynamicRouters: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: '主页',
        meta: { title: '主页' },
        component: ()=> import('../views/home/Home.vue'),
        redirect: '/index',
        children: [
            {
                path: '/index',
                name: '欢迎界面',
                meta: { title: '首页' },
                component: ()=>import('../views/pages/IndexPage.vue')
            },
            {
                path: '/layout',
                name: '自定义布局',
                meta: { title: '自定义布局' },
                component: ()=>import('../views/pages/mylayout/Index.vue')
            },
            {
                path: '/user/list',
                name: '用户列表',
                meta: { title: '用户管理' },
                component: ()=> import('../views/pages/UserList.vue')
            },
            {
                path: '/user/detail',
                name: '用户详情',
                meta: { title: '用户详情' },
                component: ()=>import('../views/pages/UserDetail.vue')
            },
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: loginRouters
});

// 拦截路由导航守卫
router.beforeEach((to, from, next)=>{
    if(to.meta.title){
        document.title = "lyf学习管理后台" + to.meta.title;
    }
    // 登录界面
    if(to.path === '/login'){
        sessionStorage.clear();
        return next();
    }
    const isLoarder = sessionStorage.getItem("isLoader");
    if(!isLoarder || !to.name || !router.hasRoute(to.name)){
        router.addRoute(dynamicRouters[0]);
        sessionStorage.setItem("isLoader", "true");
        return next({
            ...to,
            replace: true
        });
    }
    // token拦截
    const token = sessionStorage.getItem('token');
    if(!token){
        return next('/login');
    }
    return next();
});

export default router;